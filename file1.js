// Chiamata get per i film
axios.get( this.getbase + 'movie', {
    params:{
        api_key: this.api_key,
        query: this.filterTitle
    }
})
.then((results) => {
    // Concateno il risultato dell'api all'array globale
    this.allresults = this.allresults.concat(results.data.results);
    // Ripulisco l'input
    this.filterTitle = "";

    // Creo un ciclo aggiungere gli attori
    this.allresults.forEach((item) => {

        this.immagini(item);

        // Chiamata get per attori
        axios.get('https://api.themoviedb.org/3/movie/' + item.id + '/credits', {
            params:{
                api_key: this.api_key,
            }
        })
        .then((results) => {
            Vue.set(item, 'cast', results.data.cast);
        })
    });
});
