export function getCookies() {
    return decodeURIComponent(document.cookie)
        .split('; ')
        .reduce((acc, cur) => { const [k, v] = cur.split('='); return {...acc, [k]: v}; }, {});
}
