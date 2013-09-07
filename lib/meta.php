<?php

class Meta
{
	public function __construct(array $props = null)
	{
		if (!empty($props))
		{
			foreach ($props as $prop => $val)
			{
				$this->$prop = $val;
			}
		}
	}

	public function __get($prop)
	{
		if (empty($this->$prop)) { return null; }

		if (php_sapi_name() === 'cli')
		{
			return htmlspecialchars($this->$prop);
		}

		return $this->$prop;
	}

	public function __set($prop, $value)
	{
		$this->$prop = $value;
	}
}

