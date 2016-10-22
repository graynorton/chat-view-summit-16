# chat-view-summit-16

This repository contains the **&lt;chat-view&gt;** example app from the
[**Data Flow in Polymer Elements and Apps**](https://www.youtube.com/watch?v=pAW4YDLtPVs)
talk at [Polymer Summit 2016](https://www.polymer-project.org/summit).

If you have questions or comments, please reach out to me on
[GitHub](https://github.com/graynorton), Twitter
([@graynorton](https://twitter.com/graynorton)) or
[Polymer's public Slack channel](https://polymer-slack.herokuapp.com/) –
I'm happy to discuss!

> As of today (Oct 21, 2016), the files in this repo are still
> under-commented. I'd also like to add some additional information
> to this README, but I'm pushing to GitHub so that people can begin
> exploring. I'll try to flesh out the details soon.

## Usage

1. Clone this repository
2. `bower install`
3. `npm install`

Once you have cloned and installed, check out the various branches (described
below) to explore and compare the different versions of the app that were
discussed in the talk.

To try the app out in your browser, you'll need to start a local web server,
serving from the root of the project.

## Background

This 2016 **&lt;chat-view&gt;** example is based on
[the original](https://github.com/kevinpschaaf/chat-view-paper) from Kevin
Schaaf's [Thinking in Polymer](https://www.youtube.com/watch?v=ZDjiUmx51y8) talk
at Polymer Summit 2015.

## Purpose

The purpose of this example app is to explore two different approaches to
data flow in [Polymer](https://www.polymer-project.org):

* **Distributed | Bidirectional**: The logic implementing the app's model
  is distributed across multiple components, with each individual component
  being responsible not only for rendering a view and capturing user
  interactions, but also for managing related aspects of the model. This
  approach leads to bidirectional data flow, as notifications of data mutations
  travel up the component hiearchy and back down to other components
  within the app.

* **Centralized | Unidirectional**: The app's model is centralized; all
  mutations occur in one place, with notifications flowing in only one direction –
  down the component hiearchy. Components deeper in the hierarchy are responsible
  only for rendering views and capturing user interacactions. Information
  about these interactions is conveyed via messages – **actions** in
  [Flux](https://facebook.github.io/flux/) / [Redux](https://github.com/reactjs/redux)
  parlance - to the centralized keeper of the model, which makes the corresponding
  mutations and flows notifications down.

## Branches / Versions

* **distributed**: In this lightly modified version of the original app from
  Polymer Summit 2015, the **&lt;chat-thread-list&gt;** and
  **&lt;chat-thread-view&gt;** components are responsible for mutating the model
  in response to user actions. Two-way bindings and complex observers are used to
  propagate notifications of mutations between components, and to react to these
  notifications.

* **centralized**: All mutations occur in **&lt;chat-view&gt;**, flowing down to
  **&lt;chat-thread-list&gt;** and **&lt;chat-thread-view&gt;** via one-way
  bindings. Actions are conveyed upward via standard DOM events.

* **redux**: In this centralized version, the model is managed in a
  [Redux](https://github.com/reactjs/redux) store. The store is bound to the
  **&lt;chat-view&gt;** component using the
  **[polymer-redux](https://github.com/tur-nr/polymer-redux)** library.

* **redux-mono**: In this variation on the **redux** version, instead of binding
  the store directly to **&lt;chat-view&gt;** or one of its child components, we
  bind it to a dedicated **&lt;chat-view-store&gt;** component that can be included
  *within* any app component that needs access to the store. (This is an example of
  the **monostate pattern**, because while multiple instances of
  **&lt;chat-view-store&gt;** may exist, they are all backed by a single instance
  of the store.) Although there's no good reason to do so in such a simple app, we
  include an instance of **&lt;chat-view-store&gt;** in **&lt;chat-thread-list&gt;**
  and another in **&lt;chat-thread-view&gt;** to show that choosing a centralized /
  unidirectional approach doesn't necessarily mean flowing every change from the top
  of your component hierarchy to the bottom.
