document.addEventListener('DOMContentLoaded', () => {
    configurarTema();
    configurarImagens();
    configurarReacoes();
});

function configurarTema() {
    const botaoTema = document.querySelector('#btn-tema');
    const iconeTema = botaoTema.querySelector('.icone-tema');
    const temaSalvo = localStorage.getItem('meu-blog-tema');
    const prefereTemaEscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const iniciarEscuro = temaSalvo === 'escuro' || (!temaSalvo && prefereTemaEscuro);
    document.body.classList.toggle('tema-escuro', iniciarEscuro);
    atualizarBotaoTema();

    botaoTema.addEventListener('click', () => {
        document.body.classList.toggle('tema-escuro');

        const temaAtual = document.body.classList.contains('tema-escuro')
            ? 'escuro'
            : 'claro';

        localStorage.setItem('meu-blog-tema', temaAtual);
        atualizarBotaoTema();
    });

    function atualizarBotaoTema() {
        const temaEscuroAtivo = document.body.classList.contains('tema-escuro');

        iconeTema.textContent = temaEscuroAtivo ? '☀️' : '🌙';
        botaoTema.setAttribute('aria-pressed', String(temaEscuroAtivo));
        botaoTema.setAttribute(
            'aria-label',
            temaEscuroAtivo ? 'Ativar tema claro' : 'Ativar tema escuro'
        );
        botaoTema.title = temaEscuroAtivo ? 'Ativar tema claro' : 'Ativar tema escuro';
    }
}

function configurarImagens() {
    const imagens = document.querySelectorAll('.post-imagem');

    imagens.forEach((imagem) => {
        const container = imagem.closest('.post-imagem-container');

        const atualizarImagem = () => {
            const imagemDisponivel = imagem.complete && imagem.naturalWidth > 0;
            container.classList.toggle('sem-imagem', !imagemDisponivel);
        };

        imagem.addEventListener('load', atualizarImagem);
        imagem.addEventListener('error', atualizarImagem);
        atualizarImagem();
    });
}

function configurarReacoes() {
    const posts = document.querySelectorAll('.post');

    posts.forEach((post) => {
        const idPost = post.dataset.postId;
        const botaoCurtir = post.querySelector('.botao-curtir');
        const botaoDescurtir = post.querySelector('.botao-descurtir');
        const chaveArmazenamento = `meu-blog-reacao-${idPost}`;
        let reacaoAtual = localStorage.getItem(chaveArmazenamento);

        if (!['curtir', 'descurtir'].includes(reacaoAtual)) {
            reacaoAtual = null;
        }

        atualizarReacoes();

        botaoCurtir.addEventListener('click', () => {
            reacaoAtual = reacaoAtual === 'curtir' ? null : 'curtir';
            salvarReacao();
        });

        botaoDescurtir.addEventListener('click', () => {
            reacaoAtual = reacaoAtual === 'descurtir' ? null : 'descurtir';
            salvarReacao();
        });

        function salvarReacao() {
            if (reacaoAtual) {
                localStorage.setItem(chaveArmazenamento, reacaoAtual);
            } else {
                localStorage.removeItem(chaveArmazenamento);
            }

            atualizarReacoes();
        }

        function atualizarReacoes() {
            atualizarBotao(botaoCurtir, reacaoAtual === 'curtir');
            atualizarBotao(botaoDescurtir, reacaoAtual === 'descurtir');
        }

        function atualizarBotao(botao, estaAtivo) {
            botao.classList.toggle('ativo', estaAtivo);
            botao.setAttribute('aria-pressed', String(estaAtivo));
            botao.querySelector('.contador').textContent = estaAtivo ? '1' : '0';
        }
    });
}
