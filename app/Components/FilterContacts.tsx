import React from 'react'

export default function FilterContacts({onTextChange}: {onTextChange: (text: string) => void}) {

    const handleChange = (text: any) => {
        onTextChange(text.target.value)     // on remonte la val au niveau suppérieur
    }

    return (
        <div className="component-search-input">
            <h2>********************** Recherche de Trackers **********************</h2>
            <div>
                <input type='text' placeholder='Recherche' onChange={handleChange} />
            </div>
        </div>)
}