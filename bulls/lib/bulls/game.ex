defmodule Bulls.Game do

  # Credit to Nat Tuck's 07 Lecture notes
  #https://github.com/NatTuck/scratch-2021-01/blob/master/notes-4550/07-phoenix/notes.md

  def new do
    %{
      secret: generateSecretCode(),
      guesses: [],
      results: [],
      status: "",
      playing: true,
      players: [],
      ready: [],
      observers: [],
      game_started: false
      current_guesses: []
      current_results: []
    }
  end

  def leave(state,user_name) do
      #List.delete(state.players,user_name)
      #List.delete(state.ready,user_name)
      #List.delete(state.observers,user_name)
      %{%{%{state | players: List.delete(state.players,user_name)}
      | observers: List.delete(state.observers,user_name)}
      | ready: List.delete(state.ready,user_name)}

  end

  def reset(state,user_name) do
    if (Enum.member?(state.ready,user_name)) do
    %{
      secret: generateSecretCode(),
      guesses: [],
      results: [],
      status: "",
      playing: true,
      players: state.players,
      ready: [],
      observers: [],
      game_started: false
      current_guesses: []
      current_results: []
    }
    else
    state
  end
  end

  def add_player(state,user_name) do
    if state.game_started do
      %{%{state | observers: [user_name | state.observers]} | players: [user_name | state.players]}
      else
      %{state | players: [user_name | state.players]}
      end

  end

  def ready_up(state,user_name) do
       if ((length(List.delete(state.ready,user_name)) + length(List.delete(state.observers,user_name))) >= (length(state.players)-1)) do
          %{%{%{%{state | game_started: true} | ready: List.delete(state.ready,user_name)}
          | observers: List.delete(state.observers,user_name)}
          | ready: [user_name | state.ready]}
        else
          %{%{%{state | ready: List.delete(state.ready,user_name)}
          | observers: List.delete(state.observers,user_name)}
          | ready: [user_name | state.ready]}
      end
  end

  def observe(state,user_name) do
      if ((length(List.delete(state.ready,user_name)) + length(List.delete(state.observers,user_name))) >= (length(state.players)-1)) do
          %{%{%{%{state | game_started: true} | ready: List.delete(state.ready,user_name)}
          | observers: List.delete(state.observers,user_name)}
          | observers: [user_name | state.observers]}
        else
          %{%{%{state | ready: List.delete(state.ready,user_name)}
          | observers: List.delete(state.observers,user_name)}
          | observers: [user_name | state.observers]}
      end

  end


  def make_guess(state,numbers,user_name) do
    if (Enum.member?(state.ready,user_name)) do


    bulls = 0

    word = String.graphemes(numbers)
    #idxs = [0,1,2,3]
    cow_bulls = Enum.reduce(0..3,{0,0},fn x,acc ->
      cond do
           Enum.member?(state.secret,Enum.at(word,x))->
           cond do
           Enum.at(word,x) == Enum.at(state.secret,x) ->
             {elem(acc,0)+1,elem(acc,1)}
           true ->
              {elem(acc,0),elem(acc,1)+1} end

      true ->
        acc

      end
    end)

    out = to_string(elem(cow_bulls,0)) <> "A" <> to_string(elem(cow_bulls,1)) <> "B"

    %{%{state | current_guesses: Keyword.put{state.current_guesses, :user_name, numbers}]} | current_results: Keyword.put{state.current_results,:user_name, out}}


     cond do
      word == state.secret ->
      %{%{%{%{state | guesses: [numbers  | state.guesses]} | results: [out | state.results]} | playing: false} | status: "You Won!"}
      #length(state.guesses) >= 7 ->
      #%{%{%{%{state | guesses: [numbers | state.guesses]} | results: [out | state.results]} | playing: false} | status: "You lost. The secret was " <> to_string(state.secret)}
      true ->
      %{%{state | guesses: [numbers | state.guesses]} | results: [out | state.results]}

      end

      else
      state
      end
  end




  def view(state,name) do

    %{
    #word: word,
    #guesses: MapSet.to_list(state.guesses)
      name: name,
      guesses: state.guesses,
      results: state.results,
      status: state.status,
      playing: state.playing,
      players: state.players,
      ready: state.ready,
      observers: state.observers,
      game_started: state.game_started
    }
  end

  def generateSecretCode() do
        possible = ["0","1","2","3","4","5","6","7","8","9"]
        code = []
        num1 = Enum.random(possible)
        possible = List.delete(possible,num1)
        code = [num1 | code]
        num2 = Enum.random(possible)
        possible = List.delete(possible,num2)
        code = [num2 | code]
        num3 = Enum.random(possible)
        possible = List.delete(possible,num3)
        code = [num3 | code]
        num4 = Enum.random(possible)
        code = [num4 | code]
        code
        #["1","2","3","4"]
        end
end
