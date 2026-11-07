import React, { useState } from "react";

function Messages() {
    const [showModal, setShowModal] = useState(false);

    const inboxQueries = [
        {
            sender: "Ravi Sharma",
            message: "Need update on fee structure clarification.",
            time: "10:15 AM, Aug 1",
        },
        {
            sender: "Meena Iyer",
            message: "Complaint about classroom projector.",
            time: "09:30 AM, Aug 1",
        },
        {
            sender: "Sonal Kapoor",
            message: "Request for syllabus for Term 2.",
            time: "Yesterday, 4:45 PM",
        },
    ];

    const handleReplyClick = (query) => {
        setSelectedQuery(query);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedQuery(null);
    };

    return (
        <div className="bg-white text-black rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Admin Inbox (Queries)</h2>
                <button className="text-purple-600 text-sm">View all...</button>
            </div>
            {inboxQueries.length > 0 ? (
                <div className="space-y-4">
                    {inboxQueries.map((query, i) => (
                        <div
                            key={i}
                            className="p-4 bg-gray-50 border rounded flex justify-between items-center"
                        >
                            <div>
                                <p className="font-semibold">{query.sender}</p>
                                <p className="text-sm text-gray-600 truncate">
                                    {query.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {query.time}
                                </p>
                            </div>
                            <button
                                onClick={() => handleReplyClick(query)}
                                className="text-sm bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                            >
                                Reply
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500 py-10">
                    No new queries at the moment.
                </div>
            )}
            {showModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-lg font-semibold mb-2">
                            Reply to {selectedQuery.sender}
                        </h2>
                        <p className="text-sm text-gray-500 mb-4">
                            {selectedQuery.message}
                        </p>
                        <textarea
                            placeholder="Type your reply here..."
                            className="w-full h-32 p-3 border rounded mb-4 resize-none"
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 text-white bg-purple-600 rounded hover:bg-purple-700"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Messages;
