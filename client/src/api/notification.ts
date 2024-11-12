/*Import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

const NotificationComponent: React.FC = () => {
    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {
        // Listen for new comments
        socket.on('new-comment', (data) => {
            setNotifications((prev) => [...prev, data]);
        });

        return () => {
            socket.off('new-comment');
        };
    }, []);

    return (
        <div>
            <h2>Notifications</h2>
            <ul>
                {notifications.map((notification, index) => (
                    <li key={index}>
                        User {notification.userId} commented on post {notification.postId}: {notification.comment}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NotificationComponent;*/
