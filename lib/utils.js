//----------------------------------------------------------------------------------------------------------------------
// Utility functions
//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    get(obj, path, def)
    {
        if(Array.isArray(path))
        {
            path = path.join('.');
        } // end if

        const fullPath = path
            .replace(/\[/g, '.')
            .replace(/]/g, '')
            .split('.')
            .filter(Boolean);

        return fullPath.every((step) => !(step && (obj = obj[step]) === undefined)) ? obj : def;
    },
    range(start, end, step = 1)
    {
        if(end === undefined)
        {
            if(start < 0)
            {
                step = -1;
            } // end if

            end = start;
            start = 0;
        } // end if

        const length = Math.floor((end - start) / step);
        return Array.from({ length }, (_, i) => (i * step) + start);
    }
}; // end exports

//----------------------------------------------------------------------------------------------------------------------
