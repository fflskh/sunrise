
function deepFreeze (obj) {
    // Retrieve the property names defined on obj
    let propNames = Object.getOwnPropertyNames(obj);
    // Freeze properties before freezing self
    propNames.forEach(function(name) {
        let prop = obj[name];
        // Freeze prop if it is an object
        if (typeof prop === 'object' && prop !== null) {
            deepFreeze(prop);
        }
    });
    // Freeze self (no-op if already frozen)
    return Object.freeze(obj);
}


module.exports = {
    merge: (objects) => {
        let first = objects[0];
        if (!first) {
            return {};
        }
        let ref = objects.slice(1);
        let j = 0;
        let len = ref.length;
        for (; j < len; j++) {
            let object = ref[j];
            for (let k in object) {
                if (object.hasOwnProperty(k)) {
                    first[k] = object[k];
                }
            }
        }
        return first;
    },
    deepFreeze: (obj) => {
        return deepFreeze(obj);
    },
    isProductionMode: process.env.NODE_ENV === 'production'
};
