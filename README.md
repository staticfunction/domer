#DOMER
========

A tool that helps you create TypeScript modules from plain HTML!

[![Build Status](https://travis-ci.org/staticfunction/domer.svg?branch=master)](https://travis-ci.org/staticfunction/domer)

##Install
```shell
npm install domer -g
```

##Getting Started
1. Go to the directory where you put your HTML files.
2. Run domer
```shell
domer
```
3. You'll see generated Typescript files in the same directory with the same name as the HTML file!

From this:
```shell
.
├── Todo.html
└── users
    └── UserProfile.html
```
To this:
```shell
.
├── Todo.html
├── Todo.ts
└── users
    ├── UserProfile.html
    └── UserProfile.ts
```
From HTML:
```html
<div>
    <input type="checkbox" id="checkboxDisplay"/>
    <label id="title" class="header, important"></label>
    <data id="attachment"></data>
</div>
```

To Typescript:

```ts
class Todo {

    root: DocumentFragment;
    checkboxDisplay: HTMLInputElement;
    title: HTMLLabelElement;
    attachment: any;

    constructor() {
        this.root = document.createDocumentFragment();
        var n0 = document.createElement('div');
        this.checkboxDisplay = document.createElement('input');
        this.checkboxDisplay.setAttribute('type', 'checkbox');
        this.title = document.createElement('label');
        this.title.setAttribute('class', 'header, important');
        this.attachment = document.createElement('data');
        this.root.appendChild(n0);
        n0.appendChild(this.checkboxDisplay);
        n0.appendChild(this.title);
        n0.appendChild(this.attachment);
    }

    appendTo(parent:HTMLElement): void {
        parent.appendChild(this.root);
    }
}

export = Todo;
```

Then you can use this class and load it on runtime:

```ts
import Todo = require('./views/Todo');

var myTodo:Todo = new Todo();
myTodo.appendTo(todoList);

```

###Specifying a source
Domer accepts globbing patterns.

To generate Typescript files for all your HTML files (including files in subdirectory)

```shell
domer -s views/**/*.html
```

You can even specify other file types as long as their content are in HTML.

```shell
domer -s views/**/*.partial
```

###DOM ID treatment

####strip
By default, domer will strip the ID from each HTML element. To avoid DOM ID conflicts, domer will not set the id on each
HTML. By eliminating the DOM ID, you can have multiple instances of the element without conflicting with other elements' id but
still be able to reference to it via class variable.
```shell
domer -s views/**/*.html -m strip
```

####resolve
This mode will set the DOM ID on each HTML element but also auto resolves it every time it's instantiated.
```shell
domer -s views/**/*.html -m resolve
```

####retain
This mode will set the DOM ID on each HTML element without modification. You also have to remember or ensure that the IDs
that you set on each element will not conflict with other elements even if those elements reside on other partials.
```shell
domer -s views/**/*.html -m retain
```