import React from 'react';

function PreviousWords({ words }) {
    return (
        <div>
            <h2>Previously Typed Words</h2>
            <ul>
                {words.map((item, index) => (
                    <li key={index}>
                        {item.word} - Correct: {item.correct ? 'Yes' : 'No'}
                        <ul>
                            <li>Correct characters: {item.details.correct}</li>
                            <li>Incorrect characters: {item.details.incorrect}</li>
                            <li>Missing characters: {item.details.missing}</li>
                            <li>Extra characters: {item.details.extra}</li>
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PreviousWords;
