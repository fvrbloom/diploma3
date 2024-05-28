import React from 'react';

const Tanda = () => {
    return (
        <div className='tanda content__body'>
            <div className='container'>
                <div className='tanda__inner'>
                    <h1 className='tanda__title title'>TANDA</h1>
                    <p className='tanda__text text'>Ойын ережесі: дұрыс жазылған сөздерді таңдап, ұпай жина!</p>
                    <img src='./images/tanda.png' alt='Tanda' className='tanda__image' />
                    <button 
                        className='tanda__button button' 
                        onClick={() => window.open('https://turashbayevajr.github.io/soilesay_tanda/', '_blank')}
                    >
                        Start Game
                    </button>
                </div>
            </div>
        </div>
    );
};


export default Tanda;
