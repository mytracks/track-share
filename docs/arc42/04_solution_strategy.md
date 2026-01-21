# Solution Strategy

* To get a good separation of concerns the system is divided into the following parts:
  * A web frontend whose files are provided by an own container running a simple web server that serves the files.
  * A backend service with the pure business logic of the application. This must be implemented using Swift 6 because I am familiar with Swift.
  * A REST API because they can easily be used by the myTracks apps.
* The implementations must contain Dockerfiles for easy deployment.
* The folder "docs/arc42" contains the architectural constraints that must ne fulfilled and not be changed by any AI agent.
* The files in "docs/ai" must be updated by any AI agent if relevant architectural principles change or are introduced.

## Repository Structure

* All files of the web front implementation must be located under the folder "src/frontend".
* All files of the backend implementation must be located under the folder "src/backend".

All AI agents are only allowed to update files in "src" and "docs/ai".


