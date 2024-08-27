export function validateProjectTitle(title: string): true | string[] {
    if (title.length < 100 && title.length > 12) {
        return true;
    } else {
        return ["Please enter a project name between 12 and 200 characters."];
    }
}

export function validateProjectTags(tags: string[]): true | string[] {
    const numberOfTags = tags.length;
    if (numberOfTags >= 1 && numberOfTags <= 7) {
        return true;
    } else {
        return ["Please select between 1 and 7 tags."];
    }
}

export function validateMentorInformation(
    mentor: object,
): true | string[] {
    const errorsMessages: string[] = [];

    if (!/.+/.test(mentor?.name)) {
        errorsMessages.push("Please enter the first name of your mentor.");
    }
    if (!/.+/.test(mentor?.organization)) {
        errorsMessages.push(
            "Please enter the relevant organization your mentor is associated with for your project.",
        );
    }
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(mentor.email)) {
        errorsMessages.push("Please enter a valid mentor email address.");
    }
    if (!/^\+?\d{0,3}(\s|-)?(\d|-| |\(|\))+$/.test(mentor.phoneNumber)) {
        errorsMessages.push(
            "Please enter a valid mentor phone number in the form +1 555-555-5555.",
        );
    }

    return errorsMessages.length > 0 ? errorsMessages : true;
}

export function validateProjectShortDescription(
    shortDescription: string,
): true | string[] {
    if (shortDescription.length > 100) {
        return true;
    } else {
        return [
            "Please enter a short description with at least 100 characters to start. You can always edit it later.",
        ];
    }
}
