Feature: Share pictures

    Scenario: Post a picture
        Clear all pictures
        From seconde Newebe, clear all pictures
        Post a new picture via the dedicated resource     
        Retrieve last pictures
        Download first returned picture
        Ensure it is the same that posted picture
        Retrieve last activities
        Check that last activity correspond to a picture creation
        From second Newebe, retrieve pictures
        From second Newebe, download first returned picture
        Ensure it is the same that posted pictures
        From second Newebe, retrieve activities
        Check that last activity correspond to a picture creation


    Scenario: Delete picture
        Clear all pictures
        From seconde Newebe, clear all pictures        
        Post a new picture via the dedicated resource
        Retrieve last pictures
        Through handler delete first picture
        Retrieve last pictures
        Check that there are no picture
        From second Newebe, retrieve pictures
        Check that there are no picture
        Retrieve last activities
        Check that last activity correspond to a picture deletion
        From second Newebe, retrieve activities
        Check that last activity correspond to a picture deletion

    Scenario: Retrieve pictures
        Clear all pictures
        Add three pictures to the database with different dates
        Retrieve all pictures through handlers
        Check that there is three pictures with the most recent one as first picture


    Scenario: Retrieve picture
        Clear all pictures
        Add three pictures to the database with different dates
        Retrieve all pictures through handlers
        Retrieve first picture hrough handler via its ID.
        Check that picture title is the same that first picture
    
   