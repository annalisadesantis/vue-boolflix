var app = new Vue({
    el: "#root",
    data: {
        // Input di ricerca
        filterTitle: "",
        // Array film
        movies: [],
        // Array serie tv
        serie: [],
        // Array film + array serie tv
        allresults: [],
        // Array flag disponibili
        availableFlags: ['it', 'en', 'es', 'fr', 'de', 'pt', 'zh', 'ru', 'ja']
    },
    methods:{
        // Funzione per calcolare il voto in 5/5
        getFasStar(average) {

            // Divido il valore voto
            let valore = average / 2;
            // Arrotondo il valore per eccesso
            let arrotondato = Math.round(valore);
            return arrotondato;
        },
        search(){

            // Eseguo la ricerca solo se il campo è stato compilato
            if(this.filterTitle.trim() != ''){
                // Chiamata get per i film
                axios.get('https://api.themoviedb.org/3/search/movie', {
                    params:{
                        api_key: 'ff1d795e3b22f2a6056bd3125c445371',
                        query: this.filterTitle
                    }
                })
                .then((results) => {
                    // Assegno al risultato dell'api all'array movies
                    this.movies = results.data.results;
                    // Ripulisco l'input
                    this.filterTitle = "";
                });
                // Chiamata get per le serie tv
                axios.get('https://api.themoviedb.org/3/search/tv', {
                    params:{
                        api_key: 'ff1d795e3b22f2a6056bd3125c445371',
                        query: this.filterTitle
                    }
                })
                .then((results) => {
                    // Assegno al risultato dell'api all'array serie
                    this.serie = results.data.results;
                    // Assegno ad uno nuovo array il risultato dei due array film e serie
                    this.allresults = this.movies.concat(this.serie);
                    console.log(this.allresults);
                });
            }
        }
    }
});
