# Introduction

I am the developer of a series of apps called myTracks for iPhone, iPad and macOS. The website is www.mytracks4mac.info. The main focus of the apps is the recording and organization of GPX tracks. All the GPX tracks are stored locally on the devices. If a user wants to share a recorded GPS track to a friend, that friend needs to have some application that is able to read and display the contents of the GPX files. But if the friend doesn't have such an application they cannot see the track.

Therefore I want to provide a feature that a user of a myTracks app can share a track with a friend so that the freind can watch the track just using their webbrowser.

So the general principal is as follows:
1) The myTracks user selects a single track in a myTracks app.
2) In the app the user uses the "Share track online" feature. The feature will upload the track to a server that I provide.
3) The user will be presented an URL that they can send to their friend, e.g. using e-mail.
4) The friend opens the link and a webpage opens showing the track on an interactive map.
5) The friend can watch the track, pan and zoom the map, but they cannot modify the track in any way.

The scope of this repository is the implemtation of the backend and frontend of this workflow. That part needed inside the myTracks app is not part of this repository.
