import React from 'react'

const Coucou = () => {
    console.log('coucou !!!')

    React.useEffect(() => {
        console.log('Coucou rendered');
    });

    return (
        <div>
            <h1>Coucou !!!</h1>
        </div>
    )
}


export default React.memo(Coucou);
