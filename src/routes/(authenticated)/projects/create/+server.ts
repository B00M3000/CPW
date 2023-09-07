
import students from '@client/data/generated/students.json';
import { user } from "@/client/stores/user";

export const POST = 
  async ({request}) => {
    const formData = await request.formData();
    const mentorFirst = formData.get('mentorFirst')
    const mentorLast = formData.get('mentorLast')
    const name = user.name.split(' ');
    const student = students.find((s:any) => s.firstName == name[0] && s.lastName == name[1] )
    const projectObject = {
        studentId: student.studentId,
        subject: formData.get('subject'),
        year: new Date().getFullYear(), 
        tags: formData.getAll('selected'),
        mentor: {
          firstName: mentorFirst,
          lastName: mentorLast,
          organization: formData.get('mentorOrg'),
          email: formData.get('mentorEmail'),
          phoneNumber: formData.get('mentorPhone')
        },
        shortDescription: formData.get('mentorOrg'),
        fullReport: formData.get('fullReport')
      };
    }
        
