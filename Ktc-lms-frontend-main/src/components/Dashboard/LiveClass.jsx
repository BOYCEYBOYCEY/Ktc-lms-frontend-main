import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AddClassSections() {
    const classes = Array.from({ length: 12 }, (_, i) => i + 1);

    const [selectedClass, setSelectedClass] = useState(null);
    const [sections, setSections] = useState(["A", "B", "C", "D"]);
    const [sameSubjects, setSameSubjects] = useState(true);
    const [subjectsModal, setSubjectsModal] = useState(false);
    const [subjects, setSubjects] = useState(["Maths", "Science", "English"]);
    const [subjectsBySection, setSubjectsBySection] = useState({});
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

    // Add/remove sections
    const addSection = () => {
        const last = sections[sections.length - 1];
        setSections([...sections, String.fromCharCode(last.charCodeAt(0) + 1)]);
    };
    const removeSection = () => {
        if (sections.length > 1) {
            setSections(sections.slice(0, -1));
        }
    };

    // Add/remove subjects
    const addSubject = () => setSubjects([...subjects, "New Subject"]);
    const removeSubject = (i) =>
        setSubjects(subjects.filter((_, idx) => idx !== i));

    const updateSubject = (i, val) => {
        const copy = [...subjects];
        copy[i] = val;
        setSubjects(copy);
    };

    // Per section handling
    const addSubjectForSection = (section) => {
        setSubjectsBySection((prev) => ({
            ...prev,
            [section]: [...(prev[section] || []), "New Subject"],
        }));
    };
    const updateSubjectForSection = (section, i, val) => {
        setSubjectsBySection((prev) => {
            const copy = [...(prev[section] || [])];
            copy[i] = val;
            return { ...prev, [section]: copy };
        });
    };

    // Save
    const handleSave = () => {
        const payload = {
            class: selectedClass,
            sections,
            subjects: sameSubjects ? subjects : subjectsBySection,
        };
        console.log("Saving data:", payload);
        alert("Saved successfully!");
        setSelectedClass(null);
        setSubjectsModal(false);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Add Class Sections</h1>
            <div className="bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {classes.map((cls) => (
                        <button
                            key={cls}
                            onClick={() => {
                                setSelectedClass(cls);
                                setSections(["A", "B", "C", "D"]);
                            }}
                            className="p-4 border rounded-md hover:bg-gray-100"
                        >
                            Class {cls}
                        </button>
                    ))}
                </div>
            </div>

            {/* Overlay for Section setup */}
            <AnimatePresence>
                {selectedClass && !subjectsModal && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                            <h2 className="text-xl font-semibold mb-4">
                                Class {selectedClass} – Sections
                            </h2>
                            <div className="flex items-center gap-2 mb-4">
                                {sections.map((s) => (
                                    <span
                                        key={s}
                                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md"
                                    >
                                        {s}
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2 mb-4">
                                <button
                                    onClick={addSection}
                                    className="px-3 py-1 bg-purple-600 text-white rounded-md"
                                >
                                    +
                                </button>
                                <button
                                    onClick={removeSection}
                                    className="px-3 py-1 bg-red-500 text-white rounded-md"
                                >
                                    -
                                </button>
                            </div>

                            <div className="mb-4">
                                <label className="font-medium block mb-2">
                                    Subjects Setup:
                                </label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            checked={sameSubjects}
                                            onChange={() =>
                                                setSameSubjects(true)
                                            }
                                        />
                                        Same for all
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            checked={!sameSubjects}
                                            onChange={() =>
                                                setSameSubjects(false)
                                            }
                                        />
                                        Different per section
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setSelectedClass(null)}
                                    className="px-4 py-2 bg-gray-300 rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => setSubjectsModal(true)}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-md"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Overlay for Subjects */}
            <AnimatePresence>
                {subjectsModal && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                            <h2 className="text-xl font-semibold mb-4">
                                {sameSubjects
                                    ? `Subjects for Class ${selectedClass}`
                                    : `Subjects for Class ${selectedClass} – Section ${sections[currentSectionIndex]}`}
                            </h2>

                            <div className="space-y-3 mb-4">
                                {(sameSubjects
                                    ? subjects
                                    : subjectsBySection[
                                          sections[currentSectionIndex]
                                      ] || []
                                ).map((subj, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-2"
                                    >
                                        <input
                                            value={subj}
                                            onChange={(e) =>
                                                sameSubjects
                                                    ? updateSubject(
                                                          i,
                                                          e.target.value
                                                      )
                                                    : updateSubjectForSection(
                                                          sections[
                                                              currentSectionIndex
                                                          ],
                                                          i,
                                                          e.target.value
                                                      )
                                            }
                                            className="flex-1 border rounded-md px-2 py-1"
                                        />
                                        <button
                                            onClick={() =>
                                                sameSubjects
                                                    ? removeSubject(i)
                                                    : null
                                            }
                                            className="px-2 py-1 bg-red-500 text-white rounded-md"
                                        >
                                            −
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() =>
                                    sameSubjects
                                        ? addSubject()
                                        : addSubjectForSection(
                                              sections[currentSectionIndex]
                                          )
                                }
                                className="px-3 py-1 bg-purple-600 text-white rounded-md mb-4"
                            >
                                + Add Subject
                            </button>

                            {/* Navigation if per section */}
                            {!sameSubjects && (
                                <div className="flex justify-between mb-4">
                                    <button
                                        disabled={currentSectionIndex === 0}
                                        onClick={() =>
                                            setCurrentSectionIndex((i) => i - 1)
                                        }
                                        className="px-3 py-1 bg-gray-300 rounded-md disabled:opacity-50"
                                    >
                                        Prev
                                    </button>
                                    <button
                                        disabled={
                                            currentSectionIndex ===
                                            sections.length - 1
                                        }
                                        onClick={() =>
                                            setCurrentSectionIndex((i) => i + 1)
                                        }
                                        className="px-3 py-1 bg-gray-300 rounded-md disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}

                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setSubjectsModal(false)}
                                    className="px-4 py-2 bg-gray-300 rounded-md"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-md"
                                >
                                    Done & Save
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
