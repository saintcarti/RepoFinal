import { Component, OnInit } from '@angular/core';
import { EventsService } from 'src/app/services/events.service';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-modify-event',
  templateUrl: './modify-event.page.html',
  styleUrls: ['./modify-event.page.scss'],
})
export class ModifyEventPage implements OnInit {
  evento: any;
  eventForm!: FormGroup; // Usamos '!' para indicar que se inicializará más tarde

  constructor(
    private apievent: EventsService,
    private alertcontroller: AlertController,
    private router: Router,
    private activated: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.activated.queryParams.subscribe(params => {
      this.evento = JSON.parse(params['event']);
    });
  }

  ngOnInit() {
    // Inicializar el formulario con los valores del evento
    this.eventForm = this.fb.group({
      id: [this.evento.id, Validators.required],
      nombre: [this.evento.nombre, Validators.required],
      fecha: [this.evento.fecha, Validators.required],
      descripcion: [this.evento.descripcion, Validators.required],
      lugar: [this.evento.lugar, Validators.required],
      imagen: [this.evento.imagen], // Puede ser opcional si no se edita
      isActive: [this.evento.isActive]
    });
  }

  // Método para actualizar el evento
  updateEvent() {
    if (this.eventForm.valid) {
      this.apievent.updateEvent(this.eventForm.value).subscribe(() => {
        this.mensaje();
      });
    }
  }

  async mensaje() {
    const alert = await this.alertcontroller.create({
      header: 'Modificando evento',
      message: 'El evento ha sido modificado',
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
