# Constraints

* All services must be executed in containers.
* On the server a traefik reverse proxy is running to handle and route the traffic. traefik is also responsible for the TLS termination.
* All persistent data must be stored in a database that is also running on the server. The deployment of the database is out of scope of this repository. That means a connection string to connect to the database will be provided.
* The backend has to provide an API to the myTracks apps. The following constraints apply:
  * The API must follow the REST principles.
  * API calls that modify the content of the database (e.g. the upload of a track) must be secured so that only the myTracks apps are able to use these API endpoints.
  * The frontend can use the API without any authentication. However, every non authenticated API call must contain a valid track identifier.
  * No client must be able to query a list of all tracks using the API.
  * When a myTracks app uploads a track the app will provide a unique string as identifier for the track. The backend has to store the track using that identifier. The myTracks app may update an existing track at a later point in time using the same identifier.
  * An uploaded track is automatically invalidated after 30 days.
  * The API must provide a feature to delete a shared track using the identifier.
* The backend logic of this service must be implemented using C' and .NET 8.
* The frontend implementation must only use pure HTML, CSS and JavaScript.
* The frontend must use MapLibre GL JS (https://github.com/maplibre/maplibre-gl-js) to display the map. The Style URL is: https://tilenew.mytracks4mac.info/styles/osm/style.json

## C# Coding Style Guides

* All namespaces must start with `info.stichling`.
* Names of variables in class must use lowerCamelCase without a `_` prefix.
* Accesses to functions, properties etc. of the current class object must be preceeded with `this.`.
