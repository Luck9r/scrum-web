'use client';
import React, { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { MeetingData } from '@/interfaces/MeetingData';
import { useParams, useRouter } from 'next/navigation';
import withRole from '@/components/withRole';
import Link from 'next/link';

const MeetingPage: React.FC = () => {
    const params = useParams();
    const router = useRouter();
    const id = params.id;

    const [meeting, setMeeting] = useState<MeetingData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMeeting = async () => {
            try {
                const response = await axios.get(`/api/meeting/${id}`);
                const mappedMeeting: MeetingData = {
                    id: response.data.id,
                    name: response.data.name,
                    boardId: response.data.board_id,
                    datetime: response.data.datetime,
                    meetingLink: response.data.meeting_link,
                    repeat: response.data.repeat,
                };
                setMeeting(mappedMeeting);
            } catch (error: any) {
                setError('Failed to fetch meeting details.' + error.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchMeeting();
        }
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setMeeting(prevMeeting => prevMeeting ? { ...prevMeeting, [name]: value } : null);
    };

    const handleSave = async () => {
        try {
            await axios.put(`/api/meeting/${id}`, meeting);
            alert('Meeting updated successfully.');
            router.push(`/board/${meeting?.boardId}/calendar`);
        } catch (error: any) {
            setError('Failed to update meeting.' + error.message);
        }
    };

    const handleRemove = async () => {
        try {
            await axios.delete(`/api/meeting/${id}`);
            alert('Meeting removed successfully.');
            router.push(`/board/${meeting?.boardId}/calendar`);
        } catch (error: any) {
            setError('Failed to remove meeting.' + error.message);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="flex flex-col items-center w-96">
            <Link href={`/board/${meeting?.boardId}/calendar`} className="btn btn-primary mb-4 mt-10 ml-10">
                Go to Calendar
            </Link>
            <div className="p-4 card bg-base-300 max-w-96 mt-10 ml-10">
                <div className="card-body">
                    <h1 className="text-3xl font-semibold mb-4 card-title">Edit Meeting</h1>
                    {meeting && (
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
                                    value={new Date(meeting.datetime).toISOString().slice(0, 16)}
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
                                    <option value="never">Never</option>
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                </select>
                            </div>
                            <div className="flex justify-between">
                                <button type="button" onClick={handleSave} className="btn btn-primary">
                                    Save
                                </button>
                                <button type="button" onClick={handleRemove} className="btn btn-error">
                                    Remove
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

const ProtectedMeetingPage = withRole(MeetingPage, ['admin', 'product_owner', 'scrum_master']);
export default ProtectedMeetingPage;
