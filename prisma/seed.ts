import { PrismaClient, ServiceCategory } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user (Dr. Acevedo)
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@restart.com' },
    update: {},
    create: {
      firstName: 'Gilliany',
      lastName: 'Acevedo',
      email: 'admin@restart.com',
      phone: '(787) 404-6909',
      password: adminPassword,
      role: 'ADMIN',
      isActive: true
    }
  });

  // Create demo patient
  const patientPassword = await bcrypt.hash('demo123', 12);
  const patient = await prisma.user.upsert({
    where: { email: 'patient@restart.com' },
    update: {},
    create: {
      firstName: 'Demo',
      lastName: 'Patient',
      email: 'patient@restart.com',
      phone: '(787) 000-0000',
      password: patientPassword,
      role: 'PATIENT',
      isActive: true
    }
  });

  // Create provider (Dr. Acevedo)
  const provider = await prisma.provider.upsert({
    where: { email: 'dra.acevedo@restart.com' },
    update: {},
    create: {
      firstName: 'Gilliany',
      lastName: 'Acevedo, D.C.',
      email: 'dra.acevedo@restart.com',
      phone: '(787) 404-6909',
      specialties: [
        'Discovery Call',
        'Initial Evaluation & Consultation',
        'Chiropractic Visit',
        'Recovery Visit',
        'Restart Relief and Movement Visit',
        'Medical Plan Initial Evaluation'
      ],
      bio: 'Dr. Gilliany Acevedo, D.C. specializes in therapeutic exercises and personalized care for active populations.',
      isActive: true
    }
  });

  // Create services
  const services = [
    {
      name: 'Discovery Call',
      description: 'Free consultation to discuss your needs and explore treatment options.',
      duration: 15,
      price: 0,
      category: ServiceCategory.CONSULTATION
    },
    {
      name: 'Initial Evaluation & Consultation',
      description: 'Comprehensive assessment with detailed examination and treatment planning.',
      duration: 75,
      price: 15000, // $150.00 in cents
      category: ServiceCategory.EVALUATION
    },
    {
      name: 'Chiropractic Visit',
      description: 'Focused chiropractic adjustment and manual therapy session.',
      duration: 15,
      price: 5500, // $55.00 in cents
      category: ServiceCategory.TREATMENT
    },
    {
      name: 'Recovery Visit',
      description: 'Therapeutic recovery session using advanced manual therapy techniques.',
      duration: 30,
      price: 8000, // $80.00 in cents
      category: ServiceCategory.RECOVERY
    },
    {
      name: 'Restart Relief and Movement Visit',
      description: 'Comprehensive rehabilitation session combining therapy and movement exercises.',
      duration: 60,
      price: 12000, // $120.00 in cents
      category: ServiceCategory.REHABILITATION
    },
    {
      name: 'Medical Plan Initial Evaluation',
      description: 'Medical evaluation designed for insurance-based treatment plans.',
      duration: 45,
      price: 10000, // $100.00 in cents
      category: ServiceCategory.MEDICAL
    }
  ];

  for (const serviceData of services) {
    const existingService = await prisma.service.findFirst({
      where: { name: serviceData.name }
    });

    if (!existingService) {
      await prisma.service.create({
        data: {
          ...serviceData,
          isActive: true
        }
      });
    }
  }

  // Create default availability for Dr. Acevedo (Monday-Friday, 8AM-12PM and 1PM-7PM)
  const defaultAvailability = [
    // Monday
    { dayOfWeek: 1, startTime: "08:00", endTime: "12:00" },
    { dayOfWeek: 1, startTime: "13:00", endTime: "19:00" },
    // Tuesday
    { dayOfWeek: 2, startTime: "08:00", endTime: "12:00" },
    { dayOfWeek: 2, startTime: "13:00", endTime: "19:00" },
    // Wednesday
    { dayOfWeek: 3, startTime: "08:00", endTime: "12:00" },
    { dayOfWeek: 3, startTime: "13:00", endTime: "19:00" },
    // Thursday
    { dayOfWeek: 4, startTime: "08:00", endTime: "12:00" },
    { dayOfWeek: 4, startTime: "13:00", endTime: "19:00" },
    // Friday
    { dayOfWeek: 5, startTime: "08:00", endTime: "12:00" },
    { dayOfWeek: 5, startTime: "13:00", endTime: "19:00" },
  ];

  for (const availability of defaultAvailability) {
    const existingAvailability = await prisma.availability.findFirst({
      where: {
        providerId: provider.id,
        dayOfWeek: availability.dayOfWeek,
        startTime: availability.startTime,
        endTime: availability.endTime
      }
    });

    if (!existingAvailability) {
      await prisma.availability.create({
        data: {
          providerId: provider.id,
          dayOfWeek: availability.dayOfWeek,
          startTime: availability.startTime,
          endTime: availability.endTime,
          active: true
        }
      });
    }
  }

  // Create sample messages
  await prisma.message.create({
    data: {
      fromUserId: admin.id,
      toUserId: patient.id,
      subject: 'Welcome to Restart!',
      content: `Welcome to Restart, ${patient.firstName}!

We're excited to be part of your wellness journey. Your patient portal gives you 24/7 access to:

- Schedule and manage appointments
- View your treatment history
- Communicate with your care team
- Access payment information
- Receive important updates

If you have any questions about using the portal, please don't hesitate to reach out.

Welcome aboard!
Dr. Gilliany Acevedo, D.C.`,
      isRead: false,
      messageType: 'SYSTEM'
    }
  });

  console.log('✅ Database seeded successfully!');
  console.log('👨‍⚕️ Admin user: admin@restart.com / admin123');
  console.log('👤 Demo patient: patient@restart.com / demo123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });