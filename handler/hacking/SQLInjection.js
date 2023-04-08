// * FOR HANDLE SQL INJECTION
const SQLi = (value) => {
    if (typeof value === "object") {
        return true;
    } else if (typeof value === "string") {
        let arrInject = ["{", "}", ":", "$", "0x3A", "0x7B", "0x24"]
        for (let i = 0; i < arrInject.length; i++) {
            if (value.toLowerCase().includes(arrInject[i].toLowerCase())) {
                return true;
            }
        }
    }

    return false;
}

export default SQLi;