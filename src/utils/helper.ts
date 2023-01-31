
export const validNumber = (str : string) => {
    for(const i of str) {
        if(isNaN((parseInt(i)))) return false
    }
    return true
}