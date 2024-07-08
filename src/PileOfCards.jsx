import React, {useEffect, useState} from "react";
import Card from "./Card";
import {v4 as uuid} from "uuid";
import "./PileOfCards.css";
import axios from "axios";

const BASE_URL = "https://deckofcardsapi.com/api/deck";

const PileOfCards = function() {
    const [deck, setDeck] = useState(null);
    const [cardPile, setCardPile] = useState([]);
    const [isBeingShuffled, setIsBeingShuffled] = useState(false);

    useEffect(function getFreshDeck() {
        async function getDeckFromAPI() {
            const newDeck = await axios.get(`${BASE_URL}/new`);
            setDeck(newDeck.data);
        }
        getDeckFromAPI();
    }, []);

    async function shuffleDeck() {
        setIsBeingShuffled(true);
        try {
            const newDeck = await axios.get(`${BASE_URL}/${deck.deck_id}/shuffle/`);
            setDeck(newDeck.data);
            setCardPile([]);
        }
        catch(err){
            alert(err);
        }
        finally {
            setIsBeingShuffled(false);
        }
    }

    async function drawNewCard() {
        try {
            const newCardData = await axios.get(`${BASE_URL}/${deck.deck_id}/draw/`);
            if (newCardData.data.remaining === 0) throw new Error("Error: no cards remaining!");
            const newCard = newCardData.data.cards[0];
            setCardPile(c => [
                ...c,
                {
                    name: newCard.suit + " " + newCard.value,
                    image: newCard.image,
                },
            ]);
        }
        catch(err) {
            alert(err);
        }
    } 

    function renderBtnIfDeckExists() {
        if (!deck) return null;

        return (
            <button
                className="Draw-Btn"
                onClick={drawNewCard}
                disabled={isBeingShuffled}
            >Draw!</button>
        )
    }

    function renderShuffleBtnIfSafe() {
        if (!deck) return null;

        return (
            <button
                className="Shuffle-Btn"
                onClick={shuffleDeck}
                disabled={isBeingShuffled}
            >Shuffle!</button>
        )
    }

    return (
        <div>
            {renderBtnIfDeckExists()}
            {renderShuffleBtnIfSafe()}
            <div className="PileOfCards">
                {cardPile.map(c => (
                    <Card 
                        key={uuid()}
                        name={c.name}
                        image={c.image}
                    />
                ))}
            </div>
        </div>
    )
}

export default PileOfCards;