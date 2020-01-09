const convertBytesToKilobytes = function (sizeInBytes) {
    return (sizeInBytes / (2 ** 10)).toFixed(2);
};

const convertBytesToMegabytes = function (sizeInBytes) {
    return (convertBytesToKilobytes(sizeInBytes) / (2 ** 10)).toFixed(2);
};

const convertBytesToGigabytes = function (sizeInBytes) {
    return (convertBytesToMegabytes(sizeInBytes) / (2 ** 10)).toFixed(2);
};

export const formatSize = function (sizeInBytes) {
    if (sizeInBytes >= (2 ** 30)) {
        return `${convertBytesToGigabytes(sizeInBytes)} Gb`;
    } else if (sizeInBytes >= (2 ** 20)) {
        return `${convertBytesToMegabytes(sizeInBytes)} Mb`;
    } else if (sizeInBytes >= (2 ** 10)) {
        return `${convertBytesToKilobytes(sizeInBytes)} Kb`;
    } else {
        return `${sizeInBytes} b`;
    }
};
