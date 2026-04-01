import { AccessLevel, AccountType } from "@/lib/enums";

type UserLike = {
    _id?: string;
    accountType?: number;
    accessLevel?: number;
    adviseeIds?: string[];
} | null | undefined;

type ProjectLike = {
    studentId?: string;
    publish?: boolean;
} | null | undefined;

function toIdString(value: unknown) {
    return value == null ? "" : value.toString();
}

export function getVisibleProjectFilter(user: UserLike) {
    return user?.accessLevel === AccessLevel.Admin ? {} : { publish: true };
}

export function canViewProject(user: UserLike, project: ProjectLike) {
    if (!project) return false;

    if (project.publish) return true;

    const projectStudentId = toIdString(project.studentId);
    const userId = toIdString(user?._id);

    const isAdmin = user?.accessLevel === AccessLevel.Admin;
    const isOwner = projectStudentId !== "" && projectStudentId === userId;
    const isAdvisorOfStudent =
        user?.accountType === AccountType.Advisor &&
        user?.adviseeIds?.some((adviseeId) => toIdString(adviseeId) === projectStudentId);

    return !!(isAdmin || isOwner || isAdvisorOfStudent);
}

export function canPubliclyCacheProjectAsset(user: UserLike, project: ProjectLike) {
    return !!(project?.publish || user?.accessLevel === AccessLevel.Admin);
}
