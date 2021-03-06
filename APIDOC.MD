# API Doc
## Auth
<u>Getting QR Code</u>
 ``GET : /api/v1/whatsapp/login``
> Used to get a QR Code to Log into Whatsapp Web
	- If not logged in, returns a **QR Code**
	- If logged in, returns a "Authenticated" message.
<hr>

<u>Logout</u>
 ``GET : /api/v1/whatsapp/logout``
> Used to logout your device (wa account) from whatsapp gateway
<hr>

<u>Check Health</u>
 ``GET : /api/v1/whatsapp/health``
> Used to check your connection whatsapp status
<hr>

## Chat
<u>Sending Messages</u>
``POST : /api/v1/whatsapp/send/text/<phone_number>``
> Request Body
> - message - contains the message to be sent
<hr>

<u>Sending Images</u>
``POST : /api/v1/whatsapp/send/image/<phone_number>``
> Request Body
> - image - contains the base64 encoded / URL of image to be sent
> - caption - (optional) - contains caption for the message
<hr>

<u>Sending PDF</u>
``POST : /api/v1/whatsapp/send/pdf/<phone_number>``
> Request Body
> - pdf - contains the base64 encoded / URL of pdf to be sent
<hr>

<u>Sending Locations</u>
``POST : /api/v1/whatsapp/send/location/<phone_number>``
> Request Body
> - latitude - contains the string of latitude
> - longitude - contains the string of longitude
> - description - (optional) - contains description for the location
<hr>

<u>Get Chat By Id</u>
``GET : /api/v1/whatsapp/send/getchatbyid/<phone_number>``
>Returns a Chat

<hr>

<u>Get Chats</u>
``GET : /api/v1/whatsapp/send/getchats``
>Returns an Array of all Chats


## Group Chat
<u>Sending Messages to Group</u>
``POST : /api/v1/whatsapp/send/group/text/<Group_Name>``
> Request Body
> - message - contains the message to be sent
<hr>

<u>Sending Images</u>
``POST : /api/v1/whatsapp/send/group/image/<Group_Name>``
> Request Body
> - image - contains the base64 encoded / URL of image to be sent
> - caption - (optional) - contains caption for the message
<hr>

<u>Sending PDF</u>
``POST : /api/v1/whatsapp/send/group/pdf/<Group_Name>``
> Request Body
> - pdf - contains the base64 encoded / URL of pdf to be sent
<hr>

<u>Sending Locations</u>
``POST : /api/v1/whatsapp/send/group/location/<Group_Name>``
> Request Body
> - latitude - contains the string of latitude
> - longitude - contains the string of longitude
> - description - (optional) - contains description for the location
<hr>


## Contact
<u>Get Contacts</u>
``GET : /api/v1/whatsapp/contact/getcontacts``
>Returns an Array of Contacts of the Current Instance

<hr>

<u>Get Contact</u>
``GET : /api/v1/whatsapp/contact/getcontact/<phone_number>``
>Returns a Contact

<hr>

<u>Get Profile Pic</u>
``GET : /api/v1/whatsapp/contact/getprofilepic/<phone_number>``
>Returns a URL of the User's Profile Picture if Privacy Settings allow it

<hr>

<u>Is Registered User</u>
``GET : /api/v1/whatsapp/contact/isregistereduser/<phone_number>``
>Returns if a given User is registered on Whatsapp
