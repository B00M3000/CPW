export function validateProjectTitle(title: string): true | string[] {
    if (title.length >= 12 && title.length <= 200) {
        return true;
    } else {
        return ["Please enter a project name between 12 and 200 characters."];
    }
}

export function validateProjectTags(tags: string[]): true | string[] {
    const numberOfTags = tags.length;
    if (numberOfTags >= 1 && numberOfTags <= 5) {
        return true;
    } else {
        return ["Please select between 1 and 5 tags."];
    }
}

export function validateProjectShortDescription(
    shortDescription: string,
): true | string[] {
    if (shortDescription.length >= 200 && shortDescription.length <= 500) {
        return true;
    } else {
        return [
            "Please enter a short description with at least 200 characters and less than 500.",
        ];
    }
}

export function validateMentorInformation(
    mentorInformation: any,
): true | string[] {

    const EMAIL_REGEX =
        // eslint-disable-next-line no-control-regex
        /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    const PHONE_REGEX =
        /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;

    const errorMessages: string[] = [];

    if (!/.+\ .+/.test(mentorInformation.fullName)) {
        errorMessages.push("Please enter the full name of your mentor.");
    }
    if (mentorInformation.fullName.length > 200) {
        errorMessages.push(
            "Mentor full name cannot be longer than 200 characters.",
        );
    }

    if (!/.+/.test(mentorInformation.organization)) {
        errorMessages.push(
            "Please enter the relevant organization your mentor is associated with for your project.",
        );
    }
    if (mentorInformation.organization.length > 200) {
        errorMessages.push(
            "Mentor organization cannot be more than 200 characters long.",
        );
    }

    if (!EMAIL_REGEX.test(mentorInformation.email)) {
        errorMessages.push("Please enter a valid mentor email address.");
    }
    if (mentorInformation.email.length > 200) {
        errorMessages.push(
            "Mentor email should not be longer than 200 characters.",
        );
    }

    if (
        !PHONE_REGEX.test(mentorInformation.phoneNumber) &&
        mentorInformation.phoneNumber.trim().length != 0
    ) {
        errorMessages.push(
            "Please enter a valid mentor phone number in the form +1 555-555-5555.",
        );
    }
    if (mentorInformation.phoneNumber.length > 100) {
        errorMessages.push(
            "Mentor phone number should not be longer than 100 characters.",
        );
    }

    return errorMessages.length > 0 ? errorMessages : true;
}
