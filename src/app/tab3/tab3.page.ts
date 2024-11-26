import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { EventsService } from '../services/events.service';
import { Observable } from 'rxjs';
import { events } from 'src/interfaces/events';
import { AuthService } from '../services/auth.service';

interface AppEvent {
  id: number;
  nombre: string;
  fecha: string;
  descripcion: string;
  lugar: string;
  imagen?: string;
}

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  Ievento: events | undefined;
  selectedEvent: AppEvent | null = null;
  puedeComentar: boolean = false;
  events: events[] = [];
  evento: events | undefined;
  intervalId:any;

  constructor(
    private menucontroller: MenuController,
    private router: Router,
    private alertcontroller: AlertController,
    private event: EventsService,
    private activated: ActivatedRoute,
    private auth: AuthService
  ) {
    // Suscripción a los parámetros del route para obtener el evento.
    this.activated.queryParams.subscribe(param => {
      console.log('Parámetros recibidos:', param);  // Verifica los parámetros
      if (param['event']) {
        this.evento = JSON.parse(param['event']);
        console.log('Evento parseado:', this.evento);  // Verifica el evento
      }
    });
    
  }

  ngOnInit() {
    // Cargar eventos
    
    this.loadEvents();
  
    this.startAutoRefresh();
  
  }
  

  // Método para verificar si el usuario está inscrito en el evento
  verificarAsistencia(eventoId: string) {
    const usuarioId = this.auth.getUserById();
    if (usuarioId && eventoId) {
      this.event.verificarInscricion(usuarioId, eventoId).subscribe(inscrito => {
        this.puedeComentar = inscrito; // Permitir comentar si está inscrito
      });
    }
  }

  // Método para mostrar el menú lateral
  mostrarMenu() {
    this.menucontroller.open('first');
  }

  // Método para cargar los eventos
  loadEvents() {
    this.event.getEvents().subscribe(datos => {
      this.events = datos;
    });
  }

  // Navegar a la página de creación de evento
  async createEvent() {
    await this.router.navigate(['/create-event']);
    this.loadEvents(); // Recargar los eventos después de crear uno nuevo
  }

  // Método para navegar a la página de modificación de un evento
  buscarEvento(Observable: any) {
    this.router.navigate(['/modify-event'], {
      queryParams: { event: JSON.stringify(Observable) }
    });
  }

  // Método para eliminar un evento
  async deleteEvent(event: AppEvent) {
    const alert = await this.alertcontroller.create({
      header: 'Eliminar evento',
      message: `¿Estás seguro de que quieres eliminar el evento "${event.nombre}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: () => {
            this.event.deleteEvent(event).subscribe(() => {
              this.mensaje();  // Mostrar mensaje de éxito
              this.loadEvents(); // Recargar eventos después de eliminar
            });
          },
        },
      ],
    });
    await alert.present();
  }


  startAutoRefresh(){
    this.intervalId = setInterval(()=>{
      this.loadEvents();
    },5000);
  }



  // Mostrar mensaje de confirmación después de eliminar un evento
  async mensaje() {
    const alert = await this.alertcontroller.create({
      header: 'Eliminando evento',
      message: 'El evento ha sido eliminado',
      buttons: [
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.router.navigate(['/tabs/tab3']);
          },
        },
      ],
    });

    await alert.present();
  }
}
