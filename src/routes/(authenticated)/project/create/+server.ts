import students from '@/client/data/generated/students.json';
import { user } from "@/client/stores/user";

export async function POST({ request }) {
  const formData = await request.formData();
  const mentorNames = formData.get('mentor').split(" ")
  const name = user.name.split(' ');
  const student = students.find(s => s.firstName == name[0] && s.lastName == name[1] )
  const projectObject = {
    studentId: student.studentId,
    subject: formData.get('subject'),
    year: new Date().getFullYear(), 
    tags: formData.getAll('selected'),
    mentor: {
      firstName: mentorNames[0],
      lastName: mentorNames[1],
      organization: formData.get('mentorOrg'),
      email: formData.get('mentorEmail'),
      phoneNumber: formData.get('mentorPhone')
    },
    shortDescription: formData.get('mentorOrg'),
    fullReport: formData.get('fullReport')
  };
}
        
