export async function POST({ locals: { user }, request }) {
    const { projectDetails, mentorInformation, existingMentorId } = await request.json();
    console.log(projectDetails, mentorInformation, existingMentorId);
    // if(projectDetails) {

    // }
}
