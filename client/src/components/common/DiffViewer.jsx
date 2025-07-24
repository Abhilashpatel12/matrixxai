
import React from 'react';
import { diffChars } from 'diff';

const DiffViewer = ({ oldText = '', newText = '' }) => {
    const differences = diffChars(String(oldText), String(newText)); // Ensure inputs are strings
    return (
        <p className="whitespace-pre-wrap bg-gray-800 p-3 rounded-md text-sm leading-relaxed">
            {differences.map((part, index) => {
                const color = part.added ? 'bg-green-900/50 text-green-300' :
                              part.removed ? 'text-gray-500 line-through' :
                              'text-gray-300';
                return <span key={index} className={color}>{part.value}</span>;
            })}
        </p>
    );
};
export default DiffViewer;