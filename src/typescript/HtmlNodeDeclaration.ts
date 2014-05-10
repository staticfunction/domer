/**
 * Created by jcabresos on 5/9/2014.
 */
class HtmlNodeDeclaration {
    name:string;
    declaration:string;
    access:string;

    constructor(name:string, declaration:string, access:string) {
        this.name = name;
        this.declaration = declaration;
        this.access = access;
    }

}

export = HtmlNodeDeclaration;