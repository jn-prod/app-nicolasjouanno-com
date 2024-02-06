import './app.css';
import { supabase } from "./lib/supabase";
import { v4 as uuidv4 } from 'uuid';
import { Component, createRef } from 'preact';
import { ChangeEvent } from 'preact/compat';

type MediaType = {name: string, metadata: {mimetype: string}, updated_at: number}

interface IAppState {
  mode: 'reader' | 'editer' | 'loader',
  medias: MediaType[],
  uploadedFileName?: string | undefined,
}

const bucket = 'jflb-live'
const folder = 'uploads'

export class App extends Component<{}, IAppState>  {
  constructor() {
    super();
    this.state = { medias: [], mode :'reader'};
  }

  private inputFile = createRef<HTMLInputElement>();

  private timer: ReturnType<typeof setInterval> | null = null;

  private handleImageChange = (e: ChangeEvent) => {
    const files = (e.target as EventTarget & { files: FileList})?.files
    if (files && files.length > 0) {
      if (this.state.uploadedFileName) this.updateImage(files)
      else this.uploadImage(files)
    }
  }

  private handleReset = () => {
    if (this.inputFile.current) this.inputFile.current.value = '';
  };

  private uploadImage = async (files: FileList) => {
    const file = files[0];
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .upload([folder,`${uuidv4()}-${file.name}`].join('/'), file)

    if (data) {
      this.setState({uploadedFileName: data.path.replace(`${folder}/`, '')})
      this.getMedia()
      
    };
    if(error) console.log(error);
    this.handleReset();
  }

  private updateImage = async (files: FileList) => {
    const file = files[0];

    if (this.state.uploadedFileName) {
      const { data, error } = await supabase
        .storage
        .from(bucket)
        .update([folder,this.state.uploadedFileName].join('/'), file)
  
      if (data) console.log('update')
      if (error) console.log(error);
    }
    this.handleReset();
  }

  private handleLiveClick = (e: MouseEvent) => {
    this.setState({uploadedFileName: (e.target as HTMLButtonElement).dataset.name})
  }

  private handleCredentials = (e: ChangeEvent) => {
    if ((e.target as HTMLInputElement)?.value === bucket) this.setState({mode: 'editer'})
  }

  private getMedia = async () => {
    if(this.state.mode === 'loader') return;

    // start loader
    const prevMode = this.state.mode
    this.setState({mode: 'loader'})

    // fetch data
    const { data, error } = await supabase.storage.from(bucket).list(folder, {
      limit: 5,
      offset: 0,
      sortBy: {
        column: 'updated_at', order:
          'desc'
      }
    });

    if (data) {
      this.setState({medias: (data as unknown as MediaType[]).filter(({name}) => name !=='.emptyFolderPlaceholder')});
    }
    if (error)console.log(71, error);

    // end loader
    this.setState({mode: prevMode})
  }

  private renderLink = (live: MediaType, innerText: string) => <a target="_blank" type={live.metadata.mimetype} href={`${import.meta.env.VITE_APP_SUPABASE_URL}/storage/v1/object/public/${bucket}/${folder}/${live.name}`}>
    {innerText}
  </a>

  private renderNewLive = () => <section>
      <h2>{this.state.uploadedFileName ? `Live en cours ${this.state.uploadedFileName}` : 'Administrer un live'}</h2>
      {
        this.state.mode === 'editer' && <input type="file" onChange={this.handleImageChange} accept=".xlsx,.xls" ref={this.inputFile} />
      }
      { this.state.mode === 'reader' && (
        <label htmlFor="credentials">Authentification
          <input style="margin-left: 4px;" id="credentials" name="credentials" type="text" onInput={this.handleCredentials}></input>
        </label>)
      }
    </section>;

  private renderWatchLive(lives: MediaType[]) {
    const live = lives.length > 0 ? lives[0] : null;
    return this.state.mode === 'reader' && (
      <section>
        <h2>Regarder le live en cours</h2>
        {
          live ? (
            <span>
              {this.renderLink(live, `Live du ${new Date(live['updated_at']).toLocaleDateString()}`)}
              - dernière modification à {new Date(live['updated_at']).toLocaleTimeString()}
            </span>
          ) : "Aucun live en cours"
        }
      </section>
    )
  }

  private renderListLives = (lives: MediaType[]) => this.state.mode === 'editer' && (
      <section>
        <h2>Historique</h2>
          <ul>
            {lives.map((media) => (
              <li>
                <span>
                  {new Date(media.updated_at).toLocaleString()} - &nbsp;
                  {this.renderLink(media, media.name)}
                  <button onClick={this.handleLiveClick} data-name={media.name}>Continuer le live</button>
                </span>
              </li>))}
          </ul>
      </section>
    )

  private renderLoader = () => this.state.mode === 'loader' && <span>Chargement en cours...</span>

  componentDidMount() {
    this.getMedia();
    // update media list every minutes
    this.timer = setInterval(() => {
      this.getMedia();
    }, 60000);
  }

  componentWillUnmount() {
    // stop when not renderable
    if (this.timer) clearInterval(this.timer);
  }

  render () {
    return (
      <>
        <h1>Live</h1>
        {this.renderNewLive()}
        {this.renderWatchLive(this.state.medias)}
        {this.renderListLives(this.state.medias)}
        {this.renderLoader()}
      </>
    )
  }
}
