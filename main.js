var app = new Vue({
    el: "#root",
    data: {
        // Input di ricerca
        filterTitle: "",
        // Array film + array serie tv
        allresults: [],
        // Array flag disponibili
        availableFlags: ['it', 'en', 'es', 'fr', 'de', 'pt', 'zh', 'ru', 'ja'],
        // Chiave per salvare la ricerca
        testo_titolo: "",
        // Ricerca titolo
        ricerca_in_corso: false,
        // Chiamata get base
        getbase: "https://api.themoviedb.org/3/search/",
        // Url imaggine base
        url_img: "https://image.tmdb.org/t/p/w342",
        // Api key
        api_key: "ff1d795e3b22f2a6056bd3125c445371"

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

                // Attivo la ricerca in corso su true
                this.ricerca_in_corso = true;

                // Mi assicuro che l'array globale sia vuotoi svuotati
                this.allresults = [];

                // Salvo il dato della ricerca in un'altra chiave
                this.testo_titolo = this.filterTitle;

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

                        if (item.poster_path != null) {
                            item.poster_path = this.url_img + item.poster_path;
                        // Quando hanno null inserisco un'immagine salvata
                        }else{
                            item.poster_path = 'img-no-disp.png';
                        }

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
            }
        }
    },
    mounted(){
        axios.get('https://api.themoviedb.org/3/movie/top_rated', {
            params:{
                api_key: this.api_key,
            }
        })
        .then((results) => {
            // Assegno al risultato dell'api all'array movies
            this.allresults = results.data.results;

            this.allresults.forEach((item) => {

                if (item.poster_path != null) {
                    item.poster_path = this.url_img + item.poster_path;
                // Quando hanno null inserisco un'immagine salvata
                }else{
                    item.poster_path = 'img-no-disp.png';
                }

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

    }
});
