export const environment = {
    production: true,
    hmr: false,
    basePath: '//localhost:8080/autotesting/',
    getUrl: (relativeUrl: string) => {
        return environment.basePath + relativeUrl;
    },
};
