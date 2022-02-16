/**
 * Changes State value if and only if (IFF) state is false
 * @param e {Array} - [boolean, fn]
 */
const IFF = (e: Array<any>) => {
    let [state, setState] = e
    if(!state){setState(!state)}
}


export const ZTC = {
    IFF,
}