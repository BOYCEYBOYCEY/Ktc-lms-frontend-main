// resources/js/components/Admin/AddClassSections.jsx
import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { config } from "../../../config";

// Class groups
const CLASS_GROUPS = {
    "Primary (1–5)": [1, 2, 3, 4, 5],
    "Secondary (6–10)": [6, 7, 8, 9, 10],
    "Senior Secondary (11–12)": [11, 12],
};

const INITIAL_SECTIONS = ["A", "B", "C", "D"];

const DEFAULT_SUBJECTS_BY_CLASS = {
    1: ["English", "Math", "EVS"],
    2: ["English", "Math", "EVS"],
    3: ["English", "Math", "EVS"],
    4: ["English", "Math", "EVS", "Science"],
    5: ["English", "Math", "Science", "Social Studies"],
    6: ["English", "Math", "Science", "Social Studies"],
    7: ["English", "Math", "Science", "Social Studies"],
    8: ["English", "Math", "Science", "Social Studies"],
    9: ["English", "Math", "Science", "Social Studies"],
    10: ["English", "Math", "Physics", "Chemistry", "Biology"],
    11: ["English", "Physics", "Chemistry", "Mathematics"],
    12: ["English", "Physics", "Chemistry", "Mathematics"],
};

const STREAMS_BY_CLASS = {
    11: ["Science", "Commerce", "Arts"],
    12: ["Science", "Commerce", "Arts"],
};

function nextSectionLetter(sections) {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    for (let l of letters) {
        if (!sections.includes(l)) return l;
    }
    return null;
}

export default function AddClassSections() {
    const [activeClass, setActiveClass] = useState(null);
    const [sections, setSections] = useState([]);
    const [sameSubjectsForAll, setSameSubjectsForAll] = useState(true);
    const [subjectsState, setSubjectsState] = useState({});
    const [subjectModalSection, setSubjectModalSection] = useState(null);
    const [loadingSave, setLoadingSave] = useState(false);

    const [streamModalClass, setStreamModalClass] = useState(null);
    const [selectedStream, setSelectedStream] = useState(null);

    function openClassModal(cls) {
        if (cls >= 11) {
            setStreamModalClass(cls);
            return;
        }
        initializeClassModal(cls);
    }

    function initializeClassModal(cls) {
        setActiveClass(cls);
        setSections([...INITIAL_SECTIONS]);
        setSameSubjectsForAll(true);
        const defaults = DEFAULT_SUBJECTS_BY_CLASS[cls] || ["English", "Math"];
        setSubjectsState({ common: { defaults: [...defaults], extras: [] } });
        setSubjectModalSection(null);
    }

    function closeClassModal() {
        setActiveClass(null);
        setSections([]);
        setSubjectsState({});
        setSameSubjectsForAll(true);
        setSubjectModalSection(null);
        setSelectedStream(null);
    }

    function addSection() {
        const next = nextSectionLetter(sections);
        if (!next) return;
        setSections((s) => {
            const updated = [...s, next];
            if (!sameSubjectsForAll) {
                setSubjectsState((prev) => ({
                    ...prev,
                    [next]: {
                        defaults: [
                            ...(DEFAULT_SUBJECTS_BY_CLASS[activeClass] || []),
                        ],
                        extras: [],
                    },
                }));
            }
            return updated;
        });
    }

    function removeSection() {
        if (sections.length <= 1) return;
        const removed = sections[sections.length - 1];
        setSections((s) => s.slice(0, -1));
        if (!sameSubjectsForAll) {
            setSubjectsState((prev) => {
                const copy = { ...prev };
                delete copy[removed];
                return copy;
            });
        }
    }

    function toggleSameSubjects(value) {
        setSameSubjectsForAll(!!value);
        if (value) {
            const defaults = DEFAULT_SUBJECTS_BY_CLASS[activeClass] || [];
            setSubjectsState({
                common: { defaults: [...defaults], extras: [] },
            });
        } else {
            const base = subjectsState.common || {
                defaults: DEFAULT_SUBJECTS_BY_CLASS[activeClass] || [],
                extras: [],
            };
            const bySection = {};
            sections.forEach(
                (sec) =>
                    (bySection[sec] = {
                        defaults: [...base.defaults],
                        extras: [...base.extras],
                    })
            );
            setSubjectsState(bySection);
        }
    }

    function openSubjectModalFor(sectionKey) {
        setSubjectModalSection(sectionKey);
        setSubjectsState((prev) => {
            if (prev[sectionKey]) return prev;
            return {
                ...prev,
                [sectionKey]: {
                    defaults: [
                        ...(DEFAULT_SUBJECTS_BY_CLASS[activeClass] || []),
                    ],
                    extras: [],
                },
            };
        });
    }

    function addSubjectTo(key) {
        setSubjectsState((prev) => {
            const copy = { ...prev };
            copy[key] = copy[key] || { defaults: [], extras: [] };
            copy[key].extras = [...(copy[key].extras || []), ""];
            return copy;
        });
    }

    function removeExtraSubjectAt(key, idx) {
        setSubjectsState((prev) => {
            const copy = { ...prev };
            copy[key] = copy[key] || { defaults: [], extras: [] };
            copy[key].extras = copy[key].extras.filter((_, i) => i !== idx);
            return copy;
        });
    }

    function updateExtraSubjectAt(key, idx, value) {
        setSubjectsState((prev) => {
            const copy = { ...prev };
            copy[key] = copy[key] || { defaults: [], extras: [] };
            copy[key].extras = copy[key].extras.map((s, i) =>
                i === idx ? value : s
            );
            return copy;
        });
    }

    function resetDefaults(key) {
        const defaults = DEFAULT_SUBJECTS_BY_CLASS[activeClass] || [];
        setSubjectsState((prev) => ({
            ...prev,
            [key]: {
                ...(prev[key] || { extras: [] }),
                defaults: [...defaults],
            },
        }));
    }

    async function handleSaveAll() {
        const payload = {
            class: activeClass,
            stream: selectedStream,
            sections: sections.map((sec) => {
                const data = sameSubjectsForAll
                    ? subjectsState.common
                    : subjectsState[sec];
                return {
                    section: sec,
                    subjects: [
                        ...(data?.defaults || []),
                        ...(data?.extras || []).filter(Boolean),
                    ],
                };
            }),
        };

        try {
            setLoadingSave(true);
            const endpoint =
                config?.CLASS_SETUP_ENDPOINT || "/api/classes/setup";
            await axios.post(
                `${config?.API_BASE_URL || ""}${endpoint}`,
                payload,
                {
                    headers: { "Content-Type": "application/json" },
                }
            );
            alert("Saved successfully");
            closeClassModal();
        } catch (err) {
            console.error(err);
            alert("Failed to save. Check console for details.");
        } finally {
            setLoadingSave(false);
        }
    }

    function selectStream(stream) {
        setSelectedStream(stream);
        setStreamModalClass(null);
        initializeClassModal(streamModalClass);
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-extrabold mb-6 text-gray-800">
                Class & Section Setup
            </h1>

            <div className="space-y-6">
                {Object.entries(CLASS_GROUPS).map(([groupName, classes]) => (
                    <div
                        key={groupName}
                        className="bg-white rounded-xl shadow-md overflow-hidden"
                    >
                        <div className="w-full px-6 py-3 font-semibold text-lg bg-gray-100 border-b">
                            {groupName}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 p-4">
                            {classes.map((cls) => (
                                <motion.button
                                    key={cls}
                                    whileHover={{ y: -3, scale: 1.03 }}
                                    className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg cursor-pointer border border-gray-200 flex flex-col items-center justify-between transition-all duration-150"
                                    onClick={() => openClassModal(cls)}
                                >
                                    <div className="text-gray-600 font-semibold">
                                        Class
                                    </div>
                                    <div className="text-3xl font-bold text-gray-800 mt-1">
                                        {cls}
                                    </div>
                                    <div className="mt-2 text-sm text-gray-500">
                                        Sections: A - D
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Stream Modal */}
            <AnimatePresence>
                {streamModalClass && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setStreamModalClass(null)}
                        ></div>

                        {/* Improved UI */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative bg-white rounded-2xl w-[90%] md:w-2/3 p-6 shadow-2xl border border-gray-200"
                        >
                            <h2 className="text-lg font-semibold mb-4 text-center">
                                Select Stream for Class {streamModalClass}
                            </h2>
                            <div className="flex flex-wrap justify-center gap-4">
                                {STREAMS_BY_CLASS[streamModalClass].map(
                                    (stream) => (
                                        <button
                                            key={stream}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 shadow transition transform hover:-translate-y-1"
                                            onClick={() => selectStream(stream)}
                                        >
                                            {stream}
                                        </button>
                                    )
                                )}
                            </div>
                            <div className="mt-6 flex justify-center">
                                <button
                                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                    onClick={() => setStreamModalClass(null)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sections & Subjects Modal */}
            <AnimatePresence>
                {activeClass && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={closeClassModal}
                        ></div>

                        <motion.div
                            initial={{ scale: 0.95, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.95, y: 20, opacity: 0 }}
                            className="relative bg-white rounded-2xl w-[92%] md:w-3/4 lg:w-2/3 p-6 shadow-2xl border-t-4 border-indigo-500"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h2 className="text-lg font-semibold">
                                        Class {activeClass}{" "}
                                        {selectedStream
                                            ? `- ${selectedStream}`
                                            : ""}{" "}
                                        — Sections
                                    </h2>
                                    <div className="text-sm text-gray-500">
                                        Configure sections and subjects
                                    </div>
                                </div>
                                <button
                                    className="px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100"
                                    onClick={closeClassModal}
                                >
                                    Close
                                </button>
                            </div>

                            {/* Sections management UI */}
                            <div className="mb-4 flex items-center gap-3">
                                <button
                                    className="px-3 py-1 bg-green-600 text-white rounded shadow hover:bg-green-700"
                                    onClick={addSection}
                                >
                                    + Add Section
                                </button>
                                <button
                                    className="px-3 py-1 bg-red-500 text-white rounded shadow hover:bg-red-600"
                                    onClick={removeSection}
                                >
                                    − Remove Section
                                </button>

                                <div className="ml-auto flex items-center gap-3">
                                    <label className="text-sm">
                                        Subjects for all sections
                                    </label>
                                    <select
                                        value={
                                            sameSubjectsForAll
                                                ? "same"
                                                : "different"
                                        }
                                        onChange={(e) =>
                                            toggleSameSubjects(
                                                e.target.value === "same"
                                            )
                                        }
                                        className="border rounded px-2 py-1"
                                    >
                                        <option value="same">
                                            Same for all
                                        </option>
                                        <option value="different">
                                            Different per section
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
                                {sections.map((sec) => (
                                    <div
                                        key={sec}
                                        className="p-4 border rounded-xl bg-gray-50 shadow-sm"
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <div>
                                                <div className="text-lg font-semibold">
                                                    Section {sec}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    Students: —
                                                </div>
                                            </div>
                                            <button
                                                className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                                onClick={() =>
                                                    sameSubjectsForAll
                                                        ? openSubjectModalFor(
                                                              "common"
                                                          )
                                                        : openSubjectModalFor(
                                                              sec
                                                          )
                                                }
                                            >
                                                Edit Subjects
                                            </button>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Subjects:
                                        </div>
                                        <ul className="mt-2 list-disc list-inside text-sm text-gray-700">
                                            {(
                                                sameSubjectsForAll
                                                    ? subjectsState.common
                                                    : subjectsState[sec]
                                            ) ? (
                                                [
                                                    ...((sameSubjectsForAll
                                                        ? subjectsState.common
                                                              .defaults
                                                        : subjectsState[sec]
                                                              .defaults) || []),
                                                    ...((sameSubjectsForAll
                                                        ? subjectsState.common
                                                              .extras
                                                        : subjectsState[sec]
                                                              .extras) || []),
                                                ].map((s, idx) => (
                                                    <li key={idx}>
                                                        {s || "(empty)"}
                                                    </li>
                                                ))
                                            ) : (
                                                <li className="text-gray-400">
                                                    No subjects
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                    onClick={closeClassModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                    onClick={handleSaveAll}
                                    disabled={loadingSave}
                                >
                                    {loadingSave ? "Saving..." : "Done & Save"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
