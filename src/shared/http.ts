export type HttpCode = 200 | 201 | 400 | 401 | 402 | 404 | 409 | 500

// biome-ignore format: este objeto não deve ser formatado
export const HttpCode = {
  SUCCESS: 200 as HttpCode,           // A solicitação foi bem-sucedida.

  CREATED: 201 as HttpCode,           // A solicitação foi atendida e resultou na criação 
                                      // de um ou mais novos recursos.

  BAD_REQUEST: 400 as HttpCode,       // O servidor não pode ou não processará a solicitação 
                                      // devido a algo que é percebido como um erro do cliente.
  
  UNAUTHORIZED: 401 as HttpCode,      // A solicitação não foi aplicada porque não possui credenciais 
                                      // de autenticação válidas para o recurso de destino.

  PAYMENT_REQUIRED: 402 as HttpCode,

  NOT_FOUND: 404 as HttpCode,         // O servidor de origem não encontrou uma representação atual 
                                      // para o recurso de destino ou não está disposto a divulgar que existe.

  CONFLICT: 409 as HttpCode,          // A solicitação não pôde ser concluída devido a um conflito 
                                      // com o estado atual do recurso de destino. 
                                      // Esse código é usado em situações em que o usuário pode resolver 
                                      // o conflito e reenviar a solicitação.

  INTERNAL_SERVER: 500 as HttpCode,   // O servidor encontrou uma condição inesperada 
                                      // que o impediu de atender à solicitação.
}
