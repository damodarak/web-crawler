
export function redirect(pathname: string) {
    return { redirect: { permanent: false, destination: pathname }, props: {} };
}

export function notConnected() {
    return redirect("/not-connected");
}

export function getFormattedURL(url: string): string {
    let prefixLength = 0;

    if (url.startsWith("http://")) {
        prefixLength = 7;
    } else if (url.startsWith("https://")) {
        prefixLength = 8;
    } else {
        prefixLength = 0;
    }

    const withoutPrefix = url.substring(prefixLength, url.length);
    const slashIndex = withoutPrefix.indexOf("/");

    if (slashIndex === -1) {
        return withoutPrefix;
    }

    return withoutPrefix.substring(0, slashIndex);
}

export function getDateTime(dateTime: string) {
    const parts = dateTime.split(" ");
    const date = parts[0];
    const time = parts[1];

    let year = date.split("-")[0];
    let month = date.split("-")[1];
    let day = date.split("-")[2];

    let hours = time.split(":")[0];
    let minutes = time.split(":")[1];
    let seconds = time.split(":")[2];

    if (month.length === 1) month = "0" + month;
    if (day.length === 1) day = "0" + day;
    if (hours.length === 1) hours = "0" + hours;
    if (minutes.length === 1) minutes = "0" + minutes;
    if (seconds.length === 1) seconds = "0" + seconds;

    return `${hours}:${minutes}:${seconds} | ${day}.${month}.${year}`;
}

export function areEmpty(...values: string[]): boolean {
    for (const value of values) {
        if (value.trim() === "") return true;
    }

    return false;
}