import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopicModel } from 'src/app/interfaces/topic.model';
import { TopicsService } from 'src/app/services/topics/model.service';
import { ActivatedRoute } from '@angular/router';
import { GetTopicModel } from 'src/app/interfaces/get.topic.model';
import { TimeagoClock, TimeagoCustomFormatter, TimeagoDefaultClock, TimeagoFormatter, TimeagoIntl, TimeagoModule } from 'ngx-timeago';
import { strings as englishStrings } from "ngx-timeago/language-strings/pt-br";


@Component({
    selector: 'app-forum-topic',
    standalone: true,
    imports: [
        CommonModule,
        TimeagoModule,
    ],
    providers: [
        { provide: TimeagoClock, useClass: TimeagoDefaultClock },
        { provide: TimeagoIntl, useClass: TimeagoIntl },
        { provide: TimeagoFormatter, useClass: TimeagoCustomFormatter },
    ],
    templateUrl: './forum-topic.component.html',
})
export class ForumTopicComponent {
    constructor(intl: TimeagoIntl, private topicsService: TopicsService, private route: ActivatedRoute) {
        intl.strings = englishStrings;
        intl.changes.next();
    }
    topicTag = "";
    loading = signal(false);
    topic = signal<GetTopicModel | null>(null);

    ngOnInit() {
        // Se você precisar observar mudanças no parâmetro (por exemplo, se a rota puder mudar dentro do mesmo componente), use:
        this.route.paramMap.subscribe(params => {
            this.topicTag = params.get('topicTag') ?? "";
            // Faça algo com o novo valor de topicTag
            this.fetchTopic();
        });
    }

    fetchTopic() {
        this.loading.set(true);
        this.topicsService.getTopicBySlug(this.topicTag).then((data) => {
            this.topic.set(data);
            this.loading.set(false);
        }).catch(e => {
            this.loading.set(false);
            alert(`Data: ${JSON.stringify(e.error)}`)
        })
    }
}
