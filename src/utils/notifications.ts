import { LocalNotifications } from '@capacitor/local-notifications';
import { weeklySchedule } from '../data/schedule';

export async function requestNotificationPermissions() {
  const { display } = await LocalNotifications.checkPermissions();
  if (display !== 'granted') {
    await LocalNotifications.requestPermissions();
  }
}

export async function scheduleTaskNotifications() {
  await LocalNotifications.cancel({ notifications: (await LocalNotifications.getPending()).notifications });

  const notificationsToSchedule = [];
  let notifId = 1;

  for (const day of weeklySchedule) {
    const dayOfWeek = day.dayOfWeek === 0 ? 7 : day.dayOfWeek; // Capacitor LocalNotifications typically uses 1=Sunday, 2=Monday, 3=Tuesday... wait, standard is 1-7 for Sunday-Saturday. Let's use weekday schedule properly.

    // Capacitor JS LocalNotifications schedule:
    // weekday: 1 = Sunday, 2 = Monday, 3 = Tuesday, 4 = Wednesday, 5 = Thursday, 6 = Friday, 7 = Saturday
    const capacitorWeekday = day.dayOfWeek === 0 ? 1 : day.dayOfWeek + 1;

    for (const task of day.tasks) {
      const [hours, minutes] = task.startTime.split(':').map(Number);

      notificationsToSchedule.push({
        id: notifId++,
        title: `ЭГО ДИСЦИПЛИНА: ${task.title}`,
        body: task.strictCoachMessage || 'Время пришло. Делай свою работу.',
        schedule: {
          on: {
            weekday: capacitorWeekday,
            hour: hours,
            minute: minutes,
          },
          allowWhileIdle: true, // Make sure it fires even in Doze mode
        },
        actionTypeId: '',
        extra: null,
      });
    }
  }

  // Schedule all notifications
  if (notificationsToSchedule.length > 0) {
    await LocalNotifications.schedule({
      notifications: notificationsToSchedule,
    });
  }
}
