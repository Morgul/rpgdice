//----------------------------------------------------------------------------------------------------------------------
// A base expression object.
//----------------------------------------------------------------------------------------------------------------------

class Expression
{
    constructor(type = 'expression')
    {
        this.type = type;
    } // end constructor

    toJSON()
    {
        return { type: this.type, ...this };
    } // end toJSON

    render()
    {
        return this.toString();
    } // end render

    // noinspection JSAnnotator
    eval()
    {
        return this.render();
    } // end eval
} // end Expression

//----------------------------------------------------------------------------------------------------------------------

module.exports = Expression;

//----------------------------------------------------------------------------------------------------------------------
