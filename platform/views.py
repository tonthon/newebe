import datetime

from urllib2 import Request, urlopen

from django.utils import simplejson as json
from django.http import HttpResponseNotFound

from newebe.lib import file_util, json_util
from newebe.lib.rest import NewebeResource, JsonResponse, CreationResponse, \
                            ErrorResponse, RestResource, SuccessResponse, \
                            BadRequestResponse, DocumentResponse

from newebe.platform.models import User, UserManager
from newebe.platform.contactmodels import Contact, ContactManager, \
                                          STATE_WAIT_APPROVAL, STATE_ERROR, \
                                          STATE_TRUSTED

from django.template.defaultfilters import slugify


class MediaFileResource(NewebeResource):
    '''
    The media file resource furnishes REST URIs to file. A resource must be set
    for each of kind of file you want to give access : a resource works returns
    only files from a specfied folder with a specified extension.
    '''

    def __init__(self, folder, extension):
        '''
        Constructor : set folder extension of returned files.

        Arguments :
            *path* The directory of the file to retrieve.
            *extension* The extension of the file to retrieve.
        '''
        self.folder = folder
        self.extension = extension

    def GET(self, request, fileName):
        '''
        Return file located at *folder* of wich name is *fileName* and 
        extension is equal to *extension*.
 
        Arguments :
            *fileName* The name of the file (without its extension) to retrieve.
        '''

        path = '%s%s.%s' % (self.folder, fileName, self.extension)
        return file_util.staticFileResponse(path)
        


class UserResource(RestResource):
    '''
    This is the main resource of the application. It allows :
     * GET : retrieve current user (newebe owner) data.
     * POST : create a new user (if user exists, error response is returned).
     * PUT : modify current user data.
    '''

    def __init__(self):
        self.methods = ['GET', 'POST', 'PUT']


    def GET(self, request):
        '''
        Retrieve current user (newebe owner) data at JSON format.
        '''
        users = list()
        user = UserManager.getUser()
        users.append(user)

        return DocumentResponse(users)

    def POST(self, request):
        '''
        Create a new user (if user exists, error response is returned) from
        sent data (user object at JSON format).
        '''        
        if UserManager.getUser():
            return ErrorResponse("User already exists.")


        data = request.raw_post_data
        print data

        if data:
            postedUser = json.loads(data)
            user = User()
            user.name = postedUser['name']
            user.save()

            return CreationResponse(user.toJson())

        else:
            return BadRequestResponse(
                    "Data are not correct. User has not been created.")


    def PUT(self, request):
        '''
        Modify current user data with sent data (user object at JSON format).
        '''
        user = UserManager.getUser()
    
        data = request.raw_post_data

        if data:
            postedUser = json.loads(data)
            user.name = postedUser["name"]
            print  data 
            print postedUser["url"]


            user.url = postedUser["url"]
            user.city = postedUser["city"]
            user.save()

        return SuccessResponse("User successfully Modified.")


class ContactsResource(NewebeResource):
    '''
    This is the resource for contact data management. It allows :
     * GET : retrieve all contacts data.
     * POST : create a new contact.
    
    ContactResource can be parameterized to retrieve only contacts
    with specific states :
      all = all contacts
      pending = only contacts that have not approved your contact request or
                contacts that returned an eroor.
      requested = contacts that wait for approval.
    '''

    def __init__(self, contactFilter = "all"):
        self.methods = ['GET', 'POST', 'PUT', 'DELETE']
        self.contactFilter = contactFilter


    def GET(self, request):
        '''
        Retrieve whole contact list at JSON format.
        '''
        if self.contactFilter and self.contactFilter is "pending":
            contacts = ContactManager.getPendingContacts()
        elif self.contactFilter and self.contactFilter is "requested":
            contacts = ContactManager.getRequestedContacts()
        else:
            contacts = ContactManager.getContacts()

        return DocumentResponse(contacts)


    def POST(self, request):
        '''
        Create a new contact from sent data (contact object at JSON format).
        '''

        data = request.raw_post_data

        if data:
            postedContact = json.loads(data)
            url = postedContact['url']
            slug = slugify(url)

            contact = Contact(
              url = url,
              slug = slug
            )
            contact.save()

            data = contact.toJson()
            req = Request(url + "platform/contacts/request/", data)

            try:
                response = urlopen(req)
                data = response.read()
                
                newebeResponse = json.loads(data)
                if not newebeResponse["success"]:
                    contact.state = STATE_ERROR
                    contact.save()

            except:
                contact.state = STATE_ERROR
                contact.save()

            return CreationResponse(contact.toJson())

        else:
            return BadRequestResponse(
                    "Wrong data. Contact has not been created.")


class ContactResource(NewebeResource):
    '''
    '''

    def __init__(self):
        self.methods = ['GET', 'PUT', 'DELETE']


    def GET(self, request, slug):
        '''
        Retrieve contact corresponding to slug at JSON format.
        '''
        contact = ContactManager.getContact(slug)

        if contact:
            contacts = [contact]
            response = JsonResponse(json_util.getJsonFromDocList(contacts))
            contact = Contact(
                name = UserManager.getUser().name,
            )

        else:
            response = HttpResponseNotFound("Contact does not exist.")

        return response

    
    def PUT(self, request, slug):
        contact = ContactManager.getContact(slug)
        contact.state = STATE_TRUSTED
        contact.save()

        user = UserManager.getUser()
        data = user.toContact().toJson()
        req = Request(contact.url + "platform/contacts/confirm/", data)

        try:
            response = urlopen(req)
            data = response.read()
                
            newebeResponse = json.loads(data)
            if not newebeResponse["success"]:
                contact.state = STATE_ERROR
                contact.save()
                return ErrorResponse("Error occurs while confirming contact.")
        except:
            contact.state = STATE_ERROR
            contact.save()
            return ErrorResponse("Error occurs while confirming contact.")


        return SuccessResponse("Contact trusted.")


    def DELETE(self, request, slug):
        '''
        Delete contact corresponding to slug.
        '''

        contact = ContactManager.getContact(slug)

        if contact:
            contact.delete()
            response = SuccessResponse("Contact has been deleted.")
        else:
            response = ErrorResponse("Contact does not exist.")
        return response


class ContactPushResource(RestResource):
    '''
    This is the resource for contact data management. It allows :
     * POST : ask for a contact authorization.
    '''

    def __init__(self):
        self.methods = ['POST', 'PUT']


    def POST(self, request):
        '''
        Create a new contact from sent data (contact object at JSON format).
        Sets its status to Wait For Approval
        '''
        data = request.raw_post_data

        if data:
            postedContact = json.loads(data)
            url = postedContact["url"]
            slug = slugify(url)
            contact = Contact(
                name = postedContact["name"], 
                url = url,
                slug = slug,
                state = STATE_WAIT_APPROVAL,
                requestDate = datetime.datetime.now()
            )
            contact.save()
            response = SuccessResponse("Request received.")
             
        else:
           response = BadRequestResponse("Sent data are incorrects.")
    
        return response





class ContactConfirmResource(RestResource):
    '''
    This is the resource for contact data management. It allows :
     * POST : confirm a contact and set its state to TRUSTED.
    '''

    def __init__(self):
        self.methods = ['POST']


    def POST(self, request):
        '''
        Update contact from sent data (contact object at JSON format).
        Sets its status to Trusted.
        '''
        data = request.raw_post_data

        if data:
            postedContact = json.loads(data)
            url = postedContact["url"]
            slug = slugify(url)
            key = postedContact["key"]
            
            contact = ContactManager.getContact(slug)
            contact.state = STATE_TRUSTED
            contact.key = key
            contact.save()
            
            response = SuccessResponse("Contact trusted.")
             
        else:
           response = BadRequestResponse("Sent data are incorrects.")
    
        return response


