export class GetDashboardCountsUseCase {
  constructor(dashboardRepository) {
    this.dashboardRepository = dashboardRepository;
  }

  async execute() {
    try {
      const [usuarios, clientes, ventas, cotizaciones] = await Promise.all([
        this.dashboardRepository.getUsuariosCount(),
        this.dashboardRepository.getClientesCount(),
        this.dashboardRepository.getVentasCount(),
        this.dashboardRepository.getCotizacionesCount()
      ]);

      return {
        success: true,
        data: {
          usuarios: usuarios.total || 0,
          clientes: clientes.total || 0,
          ventas: ventas.total || 0,
          cotizaciones: cotizaciones.total || 0
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Error al obtener los datos del dashboard'
      };
    }
  }
}