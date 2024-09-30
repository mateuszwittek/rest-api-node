import path from 'node:path';

function getFileName(filePath) {
    return path.basename(filePath, path.extname(filePath));
}

function validJSON(str){
    try {
        return JSON.parse(str);
    } catch (error) {
        if (error instanceof SyntaxError) {
            console.log('File content is not a valid JSON string');
        } else {
            console.error('An error occurred:', error);
        }
        console.log('not valid json returned');
        return false;
    }
}


export {validJSON, getFileName}