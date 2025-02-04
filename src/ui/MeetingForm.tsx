import React, { useState } from 'react';
import axios from '@/lib/axios';
import { MeetingData } from '@/interfaces/MeetingData';

interface MeetingFormProps {
    boardId: number;
    onClose?: () => void;
    onSave: (meeting: MeetingData) => void;
}

const MeetingForm: React.FC<MeetingFormProps> = ({ boardId, onClose, onSave }) => {
    const [meeting, setMeeting] = useState<Partial<MeetingData>>({
        name: '',
        datetime: '',
        meetingLink: '',
        repeat: 'none',
    });
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setMeeting(prevMeeting => ({ ...prevMeeting, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const mappedMeeting = {
                name: meeting.name,
                datetime: meeting.datetime,
                meeting_link: meeting.meetingLink,
                repeat: meeting.repeat,
            }
            const response = await axios.post(`/api/board/${boardId}/meeting`, mappedMeeting);
            setMeeting({
                name: '',
                datetime: '',
                meetingLink: '',
                repeat: 'none',
            });
            onSave(response.data);
        } catch (error: any) {
            setError(`Failed to create meeting. ${error.message}`);
        }
    };

    return (
        <div className="p-4 card bg-base-300 min-w-96 mt-36 ml-10">
            <div className="card-body">
                <h1 className="text-3xl font-semibold mb-4 card-title">Create Meeting</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={meeting.name}
                            onChange={handleInputChange}
                            className="input input-bordered w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Date and Time</label>
                        <input
                            type="datetime-local"
                            name="datetime"
                            value={meeting.datetime}
                            onChange={handleInputChange}
                            className="input input-bordered w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Meeting Link</label>
                        <input
                            type="text"
                            name="meetingLink"
                            value={meeting.meetingLink}
                            onChange={handleInputChange}
                            className="input input-bordered w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Repeat</label>
                        <select
                            name="repeat"
                            value={meeting.repeat}
                            onChange={handleInputChange}
                            className="select select-bordered w-full"
                        >
                            <option value="none">Never</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                    </div>
                    <div className="flex justify-end">
                        {onClose && (
                        <button type="button" onClick={onClose} className="btn btn-secondary mr-2">
                            Cancel
                        </button>)}
                        <button type="button" onClick={handleSave} className="btn btn-primary">
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MeetingForm;
