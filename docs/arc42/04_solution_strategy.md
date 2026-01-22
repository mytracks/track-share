# Solution Strategy

* To get a good separation of concerns the system is divided into the following parts:
  * A web frontend whose files are provided by an own container running a simple web server that serves the files.
  * A backend service with the pure business logic of the application.
  * A REST API because they can easily be used by the myTracks apps.
* A backend service must follow a layered architecture approach using the repository pattern.
* The implementations must contain Dockerfiles for easy deployment.
* The folder "docs/arc42" contains the architectural constraints that must ne fulfilled and not be changed by any AI agent.
* The files in "docs/ai" must be updated by any AI agent if relevant architectural principles change or are introduced.
* As database PostgreSQL must be used.

## Repository Structure

* All files of the web front implementation must be located under the folder "src/frontend".
* All files of the backend implementation must be located under the folder "src/backend".
* A specification of the entity model (of the backend) must be located under the folder "docs/entities".

## Constraints for AI Agents

* All AI agents are only allowed to update files in "src", "docs/entities" and "docs/ai".
* When code is generated related to entities the specifications in "docs/entities" has to be used.
* The specification of the entities must list all entities including their properties, datatypes, etc. The specification must also include an ER diagram using Mermaid syntax.
