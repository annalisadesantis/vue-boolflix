// Chiamata get per le serie tv
axios.get(this.getbase + 'tv', {
    params:{
        api_key: this.api_key,
        query: this.filterTitle
    }
})
.then((results) => {
    // Concateno il risultato dell'api all'array globale
    this.allresults = this.allresults.concat(results.data.results);

    // Rimposta lo stato della ricerca su false in quanto in questa fase è terminata
    this.ricerca_in_corso = false;

    // Creo un ciclo per modificare l'url delle immagini + il cast
    this.allresults.forEach((item) => {

        this.immagini(item);

        // Chiamata get per attori
        axios.get('https://api.themoviedb.org/3/tv/' + item.id + '/credits', {
            params:{
                api_key: this.api_key,
            }
        })
        .then((results) => {
            Vue.set(item, 'cast', results.data.cast);
        })
    });

    console.log(this.allresults);

});
